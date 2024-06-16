import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

export const NOTIFICATION_STATUS = ['ACTIVE', 'INACTIVE'];
const notificationModel = (sequelize) =>
    sequelize.define(
        TABLES.NOTIFICATION,
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
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            path: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM,
                values: NOTIFICATION_STATUS,
                allowNull: false,
                defaultValue: NOTIFICATION_STATUS[0]
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

export default notificationModel;
