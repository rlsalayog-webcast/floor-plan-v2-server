import Floor from "../model/floor";
import FloorPlan from "../model/floorPlan";
import Landmark from "../model/landmark";

export const getLandmarks = async () => {
    try {
        return await Landmark.findAll();
    } catch (err) {
        console.error("Error fetching landmarks:", err);
        throw new Error("Failed to fetch landmarks");
    }
};

export const getLandmarkById = async (_, { id }) => {
    try {
        const landmark = await Landmark.findByPk(id, {
            include: [
                {
                    model: Floor,
                    as: "floors",
                    required: false,
                },
            ],
        });
        if (!landmark) throw new Error("Landmark not found");
        return landmark;
    } catch (err) {
        console.error("Error fetching landmark:", err);
        throw new Error("Failed to fetch landmark");
    }
};

export const getFloorByLevelId = async (_, { landmarkId, levelId }) => {
    try {
        const floor = await Floor.findOne({
            where: { landmarkId: landmarkId, id: levelId },
            include: [
                {
                    model: FloorPlan,
                    as: "floorPlans",
                    required: false,
                },
            ],
        });

        if (!floor) {
            throw new Error(`Floor with level ${levelId} not found for landmark ${landmarkId}`);
        }

        return floor;
    } catch (err) {
        console.error("Error fetching floor by level:", err);
        throw new Error("Failed to fetch floor");
    }
};
