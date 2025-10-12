import FloorPlanAreaDetail from "./area/areaDetail";
import FloorPlanArea from "./area/floorPlanArea";
import Attachment from "./attachment";
import Floor from "./floor";
import FloorPlan from "./floorPlan";
import Landmark from "./landmark";

const associations = () => {
    Landmark.hasMany(Floor, { as: "floors", foreignKey: "landmarkId" });
    Floor.belongsTo(Landmark, { foreignKey: "landmarkId" });

    Floor.hasOne(FloorPlan, { as: "floorPlans", foreignKey: "floorId" });
    FloorPlan.belongsTo(Floor, { foreignKey: "floorId" });

    FloorPlan.hasOne(Attachment, { as: "attachments", foreignKey: "floorPlanId" });
    Attachment.belongsTo(FloorPlan, { foreignKey: "floorPlanId" });

    FloorPlan.hasMany(FloorPlanArea, { as: "areas", foreignKey: "floorPlanId" });
    FloorPlanArea.belongsTo(FloorPlan, { foreignKey: "floorPlanId" });

    FloorPlanArea.hasOne(FloorPlanAreaDetail, { as: "details", foreignKey: "floorPlanAreaId" });
    FloorPlanAreaDetail.belongsTo(FloorPlanArea, { foreignKey: "floorPlanAreaId" });
};

export default associations;
