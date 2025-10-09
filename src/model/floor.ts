import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";
import Landmark from "./landmark";

const Floor = sequelize.define(
    "Floor",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        landmarkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Landmark,
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

export default Floor;
