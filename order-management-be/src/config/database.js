import mysql2 from 'mysql2';
import { Sequelize } from 'sequelize';
import defineAssociations from '../api/models/associations.js';
import categoryModel from '../api/models/category.model.js';
import customerModel from '../api/models/customer.modal.js';
import hotelModel from '../api/models/hotel.model.js';
import hotelUserRelationModel from '../api/models/hotelUserRelation.model.js';
import inviteModel from '../api/models/invite.model.js';
import menuModel from '../api/models/menu.model.js';
import notificationModel from '../api/models/notification.model.js';
import orderModel from '../api/models/order.model.js';
import paymentGatewayEntitiesModel from '../api/models/paymentGatewayEntities.js';
import preferencesModel from '../api/models/preferences.model.js';
import pushSubscriptionsModel from '../api/models/pushSubscriptions.model.js';
import subscriptionModel from '../api/models/subscriptions.js';
import tableModel from '../api/models/table.model.js';
import userModel from '../api/models/user.model.js';
import { CustomError } from '../api/utils/common.js';
import env from './env.js';
import logger from './logger.js';

const config = {
    host: env.db.host,
    dialect: env.db.dialect,
    dialectModule: mysql2,
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    pool: {
        max: 3,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

let sequelizeInstance = null;
export const db = {};

const createDatabase = async () => {
    try {
        logger('info', '🚀 Connecting to the database...');
        const creatDbInstance = new Sequelize({ ...config });

        await creatDbInstance.authenticate();
        logger('info', '✅ Database connection authenticated successfully.');

        logger('info', '🏗️ Creating database if not exists...');
        await creatDbInstance.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.name}\`;`);
        logger('info', '🏢 Database created successfully.');

        await creatDbInstance.close();

        sequelizeInstance = new Sequelize({ ...config, database: env.db.name, logging: false });
        return sequelizeInstance;
    } catch (error) {
        logger('error', `❌ Error creating database: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

const getSequelizeInstance = async () => {
    if (!sequelizeInstance) {
        sequelizeInstance = await createDatabase();
    }
    return sequelizeInstance;
};

const defineModels = (sequelize) => {
    db.Sequelize = Sequelize;
    db.users = userModel(sequelize);
    db.invites = inviteModel(sequelize);
    db.hotel = hotelModel(sequelize);
    db.hotelUserRelation = hotelUserRelationModel(sequelize);
    db.tables = tableModel(sequelize);
    db.categories = categoryModel(sequelize);
    db.menu = menuModel(sequelize);
    db.preferences = preferencesModel(sequelize);
    db.customer = customerModel(sequelize);
    db.orders = orderModel(sequelize);
    db.pushSubscriptions = pushSubscriptionsModel(sequelize);
    db.notifications = notificationModel(sequelize);
    db.paymentGatewayEntities = paymentGatewayEntitiesModel(sequelize);
    db.subscriptions = subscriptionModel(sequelize);
};

const initDb = async () => {
    try {
        logger('info', '🚀 Initializing database...');
        const sequelize = await getSequelizeInstance();

        logger('info', '🛠️ Defining database models...');
        defineModels(sequelize);
        defineAssociations(db);

        logger('info', '🔄 Syncing models with database...');
        await sequelize.sync({ force: false });

        logger('info', '🎉 Database initialization completed successfully.');
    } catch (error) {
        logger('error', `❌ Error initializing database: ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export default initDb;
