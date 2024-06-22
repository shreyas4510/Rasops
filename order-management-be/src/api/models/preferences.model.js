import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

export const PAYMENT_PREFERENCE = ['BUSINESS', 'STAKEHOLDER', 'BANK', 'ON', 'OFF'];
export const NOTIFICATION_PREFERENCE = ['ON', 'OFF'];

const preferencesModel = (sequelize) =>
    sequelize.define(
        TABLES.PREFERENCES,
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
            notification: {
                type: DataTypes.ENUM,
                allowNull: false,
                values: NOTIFICATION_PREFERENCE,
                default: NOTIFICATION_PREFERENCE[0]
            },
            payment: {
                type: DataTypes.ENUM,
                allowNull: false,
                values: PAYMENT_PREFERENCE,
                default: PAYMENT_PREFERENCE[0]
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

export default preferencesModel;
