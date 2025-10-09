import sequelize from "../../utils/database";
import FloorPlanAreaDetail from "../model/area/areaDetail";
import FloorPlanArea from "../model/area/floorPlanArea";
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

export const createFloorPlan = async (_, { floorId, pathname }) => {
    try {
        const floor = await Floor.findByPk(floorId);
        if (!floor) throw new Error("Floor not found");

        const floorPlan = await FloorPlan.create({
            floorId: floorId,
            pathname,
        });

        return floorPlan;
    } catch (err) {
        console.error("Error creating floor:", err);
        throw new Error("Failed to create floor plan");
    }
};

export const createFloorPlanArea = async (_, { floorPlanId, x, y, pageNumber, details }) => {
    const t = await sequelize.transaction();

    try {
        // make sure floor plan exists
        const floorPlan = await FloorPlan.findByPk(floorPlanId);
        if (!floorPlan) throw new Error("Floor plan not found");

        // create area first
        const area = await FloorPlanArea.create({
            floorPlanId,
            x,
            y,
            pageNumber,
            transaction: t,
        });

        // then create details and link to area
        const areaDetails = await FloorPlanAreaDetail.create({
            name: details.name,
            description: details.description,
            areaId: (area as any).id,
            transaction: t,
        });

        // attach details in response
        return {
            ...area.get(),
            details: areaDetails.get(),
        };
    } catch (error) {
        console.error("Error creating area:", error);
        throw new Error("Failed to create area");
    }
};

export const updateFloorPlanArea = async (_, { floorPlanId, areas }) => {
    const t = await sequelize.transaction();

    try {
        const floorPlan: any = await FloorPlan.findOne({
            where: { id: floorPlanId },
            transaction: t,
        });

        if (!floorPlan) {
            throw new Error("Floor plan not found");
        }

        const updatedAreas: any[] = [];

        // collect ids from FE payload
        const payloadIds = areas.filter((a) => a.id).map((a) => a.id);

        // fetch existing areas from DB
        const existingAreas = await FloorPlanArea.findAll({
            where: { floorPlanId: floorPlan.id },
            transaction: t,
        });

        // find areas that exist in DB but not in FE payload
        const toDelete = existingAreas.filter(
            (dbArea: any) => !payloadIds.includes(dbArea.id.toString())
        );

        // soft delete them (assuming paranoid mode OR isDeleted flag)
        for (const delArea of toDelete) {
            await delArea.destroy({ transaction: t });
        }

        // process create/update
        for (const area of areas) {
            let floorPlanArea;

            if (!area.id) {
                // CREATE
                floorPlanArea = await FloorPlanArea.create(
                    {
                        floorId: floorPlan.id,
                        x: area.x,
                        y: area.y,
                        pageNumber: area.pageNumber,
                    },
                    { transaction: t }
                );

                await FloorPlanAreaDetail.create(
                    {
                        areaId: floorPlanArea.id,
                        name: area.details.name,
                        description: area.details.description,
                    },
                    { transaction: t }
                );
            } else {
                // UPDATE
                floorPlanArea = await FloorPlanArea.findOne({
                    where: { id: area.id, floorId: floorPlan.id },
                    transaction: t,
                });

                if (!floorPlanArea) {
                    throw new Error(`Area ${area.id} not found for floor ${floorPlanId}`);
                }

                await floorPlanArea.update(
                    {
                        x: area.x,
                        y: area.y,
                        pageNumber: area.pageNumber,
                    },
                    { transaction: t }
                );

                await FloorPlanAreaDetail.upsert(
                    {
                        areaId: floorPlanArea.id,
                        name: area.details.name,
                        description: area.details.description,
                    },
                    { transaction: t }
                );
            }

            // reload with details
            const fullFloorPlanArea = await FloorPlanArea.findByPk(floorPlanArea.id, {
                include: [{ model: FloorPlanAreaDetail, as: "details" }],
                transaction: t,
            });

            updatedAreas.push(fullFloorPlanArea);
        }

        await t.commit();
        return updatedAreas;
    } catch (err) {
        await t.rollback();
        console.error("Error updating floor areas:", err);
        throw new Error("Failed to update floor areas");
    }
};
