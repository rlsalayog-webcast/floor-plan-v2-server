import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";
import FloorPlan from "./floorPlan";

const Attachment = sequelize.define(
    "Attachment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        filePath: {
            type: DataTypes.STRING,
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

export default Attachment;
