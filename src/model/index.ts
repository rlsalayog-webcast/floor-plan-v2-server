import FloorPlanAreaDetail from "./area/areaDetail";
import FloorPlanArea from "./area/floorPlanArea";
import Floor from "./floor";
import FloorPlan from "./floorPlan";
import Landmark from "./landmark";

const associations = () => {
    Landmark.hasMany(Floor, { as: "floors", foreignKey: "landmarkId" });
    Floor.belongsTo(Landmark, { foreignKey: "landmarkId" });

    Floor.hasMany(FloorPlan, { as: "floorPlans", foreignKey: "floorId" });
    FloorPlan.belongsTo(Floor, { foreignKey: "floorId" });

    FloorPlan.hasMany(FloorPlanArea, { as: "areas", foreignKey: "floorPlanId" });
    FloorPlanArea.belongsTo(FloorPlan, { foreignKey: "floorPlanId" });

    FloorPlanArea.hasOne(FloorPlanAreaDetail, { as: "details", foreignKey: "areaId" });
    FloorPlanAreaDetail.belongsTo(FloorPlanArea, { foreignKey: "areaId" });
};

export default associations;
