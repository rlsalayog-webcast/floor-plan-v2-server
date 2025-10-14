import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";
import Floor from "./floor";

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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Floor,
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
