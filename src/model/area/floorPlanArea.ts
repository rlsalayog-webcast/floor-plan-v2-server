import { DataTypes } from "sequelize";
import sequelize from "../../../utils/database";
import FloorPlan from "../floorPlan";

const FloorPlanArea = sequelize.define(
    "FloorPlanArea",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        x: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        y: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        floorPlanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: FloorPlan,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        paranoid: true, // adds deletedAt for soft deletes
    }
);

export default FloorPlanArea;
