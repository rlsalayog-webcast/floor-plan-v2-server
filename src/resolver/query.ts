import { BUCKET_NAME } from "../constant";
import { handlePresignedUrl } from "../helper/handlePresignedUrl";
import Floor from "../model/floor";
import FloorPlanArea from "../model/floorPlanArea";
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
            order: [[{ model: Floor, as: "floors" }, "createdAt", "ASC"]],
        });
        if (!landmark) throw new Error("Landmark not found");
        return landmark;
    } catch (err) {
        console.error("Error fetching landmark:", err);
        throw new Error("Failed to fetch landmark");
    }
};

export const getFloorByLevelId = async (_, { floorId }) => {
    try {
        const floor: any = await Floor.findByPk(floorId, {
            include: [
                {
                    model: FloorPlanArea,
                    as: "areas",
                    required: false,
                },
            ],
        });

        if (!floor) {
            throw new Error(`Floor with ID ${floorId} not found`);
        }

        if (floor?.filePath) {
            const presignedUrl = await handlePresignedUrl({
                bucketName: BUCKET_NAME.documents,
                path: floor.filePath,
            });
            floor.presignedUrl = presignedUrl;
        }

        return floor;
    } catch (err) {
        console.error("Error fetching floor by floor ID:", err);
        throw new Error("Failed to fetch floor plan");
    }
};
