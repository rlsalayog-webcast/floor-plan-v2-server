import Floor from "./floor";
import FloorPlanArea from "./floorPlanArea";
import Landmark from "./landmark";

const associations = () => {
    Landmark.hasMany(Floor, { as: "floors", foreignKey: "landmarkId" });
    Floor.belongsTo(Landmark, { foreignKey: "landmarkId" });

    Floor.hasMany(FloorPlanArea, { as: "areas", foreignKey: "floorId" });
    FloorPlanArea.belongsTo(Floor, { foreignKey: "floorId" });
};

export default associations;
