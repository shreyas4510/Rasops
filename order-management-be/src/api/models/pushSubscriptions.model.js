import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const pushSubscriptionsModel = (sequelize) =>
    sequelize.define(TABLES.PUSH_SUBSCRIPTION, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: TABLES.USERS,
                key: 'id'
            }
        },
        customerId: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: TABLES.CUSTOMER,
                key: 'id'
            }
        },
        endpoint: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expiration: {
            type: DataTypes.DATE,
            allowNull: true
        },
        p256dh: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        auth: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

export default pushSubscriptionsModel;
