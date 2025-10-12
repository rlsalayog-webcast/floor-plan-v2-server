import { BUCKET_NAME } from "../constant";
import { handlePresignedUrl } from "../helper/handlePresignedUrl";
import FloorPlanAreaDetail from "../model/area/areaDetail";
import FloorPlanArea from "../model/area/floorPlanArea";
import Attachment from "../model/attachment";
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
        const floor: any = await Floor.findOne({
            where: { landmarkId: landmarkId, id: levelId },
            include: [
                {
                    model: FloorPlan,
                    as: "floorPlans",
                    required: false,
                    include: [
                        {
                            model: FloorPlanArea,
                            as: "areas",
                            required: false,
                            include: [
                                {
                                    model: FloorPlanAreaDetail,
                                    as: "details",
                                    required: false,
                                },
                            ],
                        },
                        {
                            model: Attachment,
                            as: "attachments",
                            required: false,
                        },
                    ],
                },
                {
                    model: Landmark,
                    required: false, // optional if you want to also return the parent landmark
                },
            ],
        });

        if (!floor) {
            throw new Error(`Floor with level ${levelId} not found for landmark ${landmarkId}`);
        }

        const attachment = floor?.floorPlans?.attachments;

        if (attachment) {
            const presignedUrl = await handlePresignedUrl({
                bucketName: BUCKET_NAME.documents,
                path: attachment.filePath,
            });

            attachment.presignedUrl = presignedUrl;
        }

        return floor;
    } catch (err) {
        console.error("Error fetching floor by level:", err);
        throw new Error("Failed to fetch floor");
    }
};
