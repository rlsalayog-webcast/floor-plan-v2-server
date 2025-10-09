import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";
import Floor from "./floor";

const FloorPlan = sequelize.define(
    "FloorPlan",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pathname: {
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

export default FloorPlan;
