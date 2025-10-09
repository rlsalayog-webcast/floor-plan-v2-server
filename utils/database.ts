import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(process.env.TRANSACTION_POOLER, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export const connectDB = async (callback: () => void) => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to PostgreSQL successfully!");
        await syncDB();
        await callback();
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
};

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database & tables synced!");
    } catch (error) {
        console.error("❌ Error syncing database:", error);
    }
};

export default sequelize;
