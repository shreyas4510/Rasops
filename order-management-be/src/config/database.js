import { Sequelize } from "sequelize";
import userModel from "../api/models/user.model.js";
import inviteModel from "../api/models/invite.model.js";
import hotelModel from "../api/models/hotel.model.js";
import hotelUserRelationModel from "../api/models/hotelUserRelation.model.js";
import defineAssociations from "../api/models/associations.js";
import { CustomError } from "../api/utils/common.js";
import env from "./env.js";

const config = {
    host: env.db.host,
    dialect: env.db.dialect,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
}
export const db = {};

const createDatabase = async () => {
    try {
        const sequelize = new Sequelize({ ...config })

        // authenticate the connection
        await sequelize.authenticate();

        // create table if not exists
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.name}\`;`);
        console.log(`🟢 Database initialized successfully.`);
        return new Sequelize({ ...config, database: env.db.name });
    } catch (error) {
        console.error(`🔴 Failed to initialize database: ${error.message}`);
        throw CustomError(error.code, error.message);
    }
};

// Define all database models
const defineModels = (sequelize) => {
    db.Sequelize = Sequelize;
    db.users = userModel(sequelize);
    db.invites = inviteModel(sequelize);
    db.hotel = hotelModel(sequelize);
    db.hotelUserRelation = hotelUserRelationModel(sequelize);
};

const initDb = async () => {
    try {
        // Initialize database connection and create database if necessary
        const sequelize = await createDatabase();

        // Define and associate models
        defineModels(sequelize);
        defineAssociations(db);
        // Sync models with database
        await sequelize.sync({ force: false });
        console.log("🔄 Database synchronized successfully");
    } catch (error) {
        throw CustomError(error.code, error.message);
    }
}

export default initDb;
