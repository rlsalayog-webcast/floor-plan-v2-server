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

export const getFloorByLevelId = async (_, { floorId }) => {
    try {
        const floor: any = await Floor.findByPk(floorId, {
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
            ],
        });

        if (!floor) {
            throw new Error(`Floor with ID ${floorId} not found`);
        }

        const fp = floor.floorPlans;

        if (fp?.attachments?.filePath) {
            const presignedUrl = await handlePresignedUrl({
                bucketName: BUCKET_NAME.documents,
                path: fp.attachments.filePath,
            });
            fp.attachments.presignedUrl = presignedUrl;
        }

        return floor;
    } catch (err) {
        console.error("Error fetching floor by floor ID:", err);
        throw new Error("Failed to fetch floor plan");
    }
};
