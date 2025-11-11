import sequelize from "../../utils/database";
import Floor from "../model/floor";
import FloorPlanArea from "../model/floorPlanArea";
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

export const createFloor = async (_, args) => {
    const { landmarkId, level } = args;
    try {
        const landmark = await Landmark.findByPk(landmarkId);
        if (!landmark) throw new Error("Landmark not found");

        const exists = await Floor.findOne({ where: { landmarkId, level } });
        if (exists) throw new Error(`Floor level ${level} already exists for this landmark`);

        return await Floor.create(args);
    } catch (err) {
        console.error("Error creating floor:", err);
        throw new Error("Failed to create floor");
    }
};

export const updateFloor = async (_, args) => {
    const { id, landmarkId, level } = args;
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
        await floor.update({ ...args });

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

export const updateFloorPlanWithAreas = async (_, { id, areas }) => {
    const transaction = await sequelize.transaction();

    try {
        if (!id) {
            throw new Error("Missing required field: Floor ID");
        }

        const floor = await Floor.findByPk(id, { transaction });
        if (!floor) {
            throw new Error(`Floor ${id} not found`);
        }

        // ✅ Replace areas (create, update, soft-delete)
        if (Array.isArray(areas)) {
            const existingAreas: any = await FloorPlanArea.findAll({
                where: { floorId: id },
                transaction,
                paranoid: false,
            });

            const incomingAreaIds = areas.filter((a) => a.id).map((a) => a.id);
            const areasToDelete = existingAreas.filter(
                (existing) => !incomingAreaIds.includes(existing.id)
            );

            for (const area of areasToDelete) {
                await area.destroy({ transaction });
            }

            for (const area of areas) {
                const { id: areaId, x, y, dataSetInfoId } = area;

                if (x == null || y == null) {
                    throw new Error("Each area must include x and y coordinates");
                }

                if (!dataSetInfoId) {
                    throw new Error("Each area must include dataset info id");
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

                    if (areaRecord.deletedAt) {
                        await areaRecord.restore({ transaction });
                    }

                    await areaRecord.update({ x, y, dataSetInfoId }, { transaction });
                } else {
                    await FloorPlanArea.create(
                        {
                            x,
                            y,
                            dataSetInfoId,
                            floorId: id,
                        },
                        { transaction }
                    );
                }
            }
        }

        await transaction.commit();

        // ✅ Return updated Floor with areas
        return await Floor.findByPk(id, {
            include: [{ model: FloorPlanArea, as: "areas" }],
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating floor plan with areas:", error);
        throw new Error(error.message || "Failed to update floor plan with areas");
    }
};
