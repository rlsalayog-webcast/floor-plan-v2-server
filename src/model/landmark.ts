import { DataTypes } from "sequelize";
import sequelize from "../../utils/database";

const Landmark = sequelize.define(
    "Landmark",
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
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        paranoid: true, // adds deletedAt for soft deletes
    }
);

export default Landmark;
