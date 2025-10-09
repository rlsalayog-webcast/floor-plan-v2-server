import { DataTypes } from "sequelize";
import sequelize from "../../../utils/database";
import FloorPlanArea from "./floorPlanArea";

const AreaDetail = sequelize.define(
    "AreaDetail",
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
        areaId: {
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

export default AreaDetail;
