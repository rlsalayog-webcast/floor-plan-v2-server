import sequelize from "../../utils/database";
import FloorPlanAreaDetail from "../model/area/areaDetail";
import FloorPlanArea from "../model/area/floorPlanArea";
import Attachment from "../model/attachment";
import Floor from "../model/floor";
import FloorPlan from "../model/floorPlan";
import Landmark from "../model/landmark";

export const createLandmark = async (_, args, context) => {
    try {
        const landmark = await Landmark.create(args);
        return landmark;
    } catch (err) {
        console.error("Error creating landmark:", err);
        throw new Error("Failed to create landmark");
    }
};

export const deleteLandmark = async (_, { id }) => {
    try {
        const landmark = await Landmark.findByPk(id);
        if (!landmark) {
            throw new Error("Landmark not found");
        }
        await landmark.destroy();
        return landmark;
    } catch (err) {
        console.error("Error deleting landmark:", err);
        throw new Error("Failed to delete landmark");
    }
};

export const createFloor = async (_, { landmarkId, level, name }) => {
    try {
        const landmark = await Landmark.findByPk(landmarkId);
        if (!landmark) throw new Error("Landmark not found");

        const existingFloor = await Floor.findOne({ where: { landmarkId: landmarkId, level } });
        if (existingFloor) throw new Error(`Floor level ${level} already exists for this landmark`);

        const floor = await Floor.create({
            landmarkId: landmarkId,
            level,
            name,
        });

        return floor;
    } catch (err) {
        console.error("Error creating floor:", err);
        throw new Error("Failed to create floor");
    }
};

export const updateFloor = async (_, { id, landmarkId, level, name }) => {
    try {
        const floor: any = await Floor.findByPk(id);
        if (!floor) throw new Error("Floor not found");

        // Optional: verify the floor belongs to the correct landmark
        if (landmarkId && Number(floor.landmarkId) !== Number(landmarkId)) {
            throw new Error("This floor does not belong to the specified landmark");
        }

        // If level is being updated, check for duplicates
        if (level && level !== floor.level) {
            const existingFloor = await Floor.findOne({
                where: { landmarkId: floor.landmarkId, level },
            });
            if (existingFloor) {
                throw new Error(`Floor level ${level} already exists for this landmark`);
            }
        }

        // Update fields (only if provided)
        await floor.update({
            level: level ?? floor.level,
            name: name ?? floor.name,
        });

        return floor;
    } catch (err) {
        console.error("Error updating floor:", err);
        throw new Error("Failed to update floor");
    }
};

export const deleteFloor = async (_, { id, landmarkId }) => {
    try {
        const floor = await Floor.findOne({ where: { id, landmarkId } });
        if (!floor) throw new Error("Floor not found for this landmark");

        await floor.destroy(); // 👈 will soft delete (set deletedAt)
        return true;
    } catch (err) {
        console.error("Error deleting floor:", err);
        throw new Error("Failed to delete floor");
    }
};

export const updateFloorPlanWithAreas = async (_, { floorId, id, attachments, areas }) => {
    const transaction = await sequelize.transaction();

    try {
        if (!floorId) {
            throw new Error("Missing required field: floorId");
        }

        let floorPlan;

        // 🚫 No ID: Create new FloorPlan only if attachment is valid
        if (!id) {
            if (!attachments) {
                throw new Error("Attachment is required when creating a new FloorPlan");
            }

            if (attachments.id) {
                throw new Error(
                    `Cannot update attachment ${attachments.id} — no FloorPlan exists yet`
                );
            }

            const { fileName, fileType, filePath } = attachments;

            if (!fileName || !fileType || !filePath) {
                throw new Error("Attachment must include fileName, fileType, and filePath");
            }

            // ✅ Create FloorPlan and Attachment
            floorPlan = await FloorPlan.create({ floorId }, { transaction });

            await Attachment.create(
                {
                    fileName,
                    fileType,
                    filePath,
                    floorPlanId: floorPlan.id,
                },
                { transaction }
            );
        } else {
            // ✅ ID provided: Update FloorPlan, Attachment (if id)
            floorPlan = await FloorPlan.findByPk(id, { transaction });
            if (!floorPlan) {
                throw new Error(`FloorPlan ${id} not found`);
            }

            await floorPlan.update({ floorId }, { transaction });

            // ✅ Update attachment only if attachments.id is present
            if (attachments?.id) {
                const { id: attachmentId, fileName, fileType, filePath } = attachments;

                if (!fileName || !fileType || !filePath) {
                    throw new Error("Attachment must include fileName, fileType, and filePath");
                }

                const existingAttachment = await Attachment.findByPk(attachmentId, {
                    transaction,
                });
                if (!existingAttachment) {
                    throw new Error(`Attachment ${attachmentId} not found`);
                }

                await existingAttachment.update(
                    {
                        fileName,
                        fileType,
                        filePath,
                    },
                    { transaction }
                );
            }
        }

        // ✅ Replace areas (create or update)
        if (Array.isArray(areas)) {
            // 🔍 Fetch existing areas for comparison
            const existingAreas = await FloorPlanArea.findAll({
                where: { floorPlanId: floorPlan.id },
                transaction,
                paranoid: false, // include soft-deleted for accurate diff
            });

            const incomingAreaIds = areas.filter((a) => a.id).map((a) => a.id);
            const areasToDelete = existingAreas.filter(
                (existing) => !incomingAreaIds.includes((existing as any).id)
            );

            // 🗑️ Soft delete missing areas
            for (const area of areasToDelete) {
                await area.destroy({ transaction });
            }

            for (const area of areas) {
                const { id: areaId, x, y, details } = area;

                if (x == null || y == null) {
                    throw new Error("Each area must include x and y coordinates");
                }

                if (!details || !details.name || !details.description) {
                    throw new Error(
                        "Each area must include valid details with name and description"
                    );
                }

                let areaRecord;

                if (areaId) {
                    areaRecord = await FloorPlanArea.findByPk(areaId, {
                        transaction,
                        paranoid: false,
                    });

                    if (!areaRecord) {
                        throw new Error(`FloorPlanArea ${areaId} not found`);
                    }

                    // Restore if previously soft-deleted
                    if (areaRecord.deletedAt) {
                        await areaRecord.restore({ transaction });
                    }

                    await areaRecord.update({ x, y }, { transaction });

                    const detailRecord = await FloorPlanAreaDetail.findOne({
                        where: { floorPlanAreaId: areaId },
                        transaction,
                    });

                    if (detailRecord) {
                        await detailRecord.update(
                            {
                                name: details.name,
                                description: details.description,
                            },
                            { transaction }
                        );
                    } else {
                        await FloorPlanAreaDetail.create(
                            {
                                name: details.name,
                                description: details.description,
                                floorPlanAreaId: areaId,
                            },
                            { transaction }
                        );
                    }
                } else {
                    areaRecord = await FloorPlanArea.create(
                        {
                            x,
                            y,
                            pageNumber: 1,
                            floorPlanId: floorPlan.id,
                        },
                        { transaction }
                    );

                    await FloorPlanAreaDetail.create(
                        {
                            name: details.name,
                            description: details.description,
                            floorPlanAreaId: areaRecord.id,
                        },
                        { transaction }
                    );
                }
            }
        }

        await transaction.commit();

        return await FloorPlan.findByPk(floorPlan.id, {
            include: [
                { model: Attachment, as: "attachments" },
                {
                    model: FloorPlanArea,
                    as: "areas",
                    include: [{ model: FloorPlanAreaDetail, as: "details" }],
                },
            ],
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating floor plan with areas:", error);
        throw new Error(error.message || "Failed to update floor plan with areas");
    }
};
