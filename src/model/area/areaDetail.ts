import { DataTypes } from "sequelize";
import sequelize from "../../../utils/database";
import FloorPlanArea from "./floorPlanArea";

const FloorPlanAreaDetail = sequelize.define(
    "FloorPlanAreaDetail",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floorPlanAreaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: FloorPlanArea,
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

export default FloorPlanAreaDetail;
