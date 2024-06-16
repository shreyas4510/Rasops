import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const pushSubscriptionsModel = (sequelize) =>
    sequelize.define(
        TABLES.PUSH_SUBSCRIPTION,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: TABLES.USERS,
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
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            paranoid: true
        }
    );

export default pushSubscriptionsModel;
