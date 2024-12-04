import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

export const SUBSCRIPTION_STATUS = ['ACTIVE', 'CANCELLED'];
const subscriptionModel = (sequelize) =>
    sequelize.define(
        TABLES.SUBSCRIPTION,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            hotelId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: TABLES.HOTEL,
                    key: 'id'
                }
            },
            subscriptionId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            planId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            planName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            customerId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            paymentId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM,
                values: SUBSCRIPTION_STATUS,
                allowNull: false
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            tables: {
                type: DataTypes.INTEGER,
                allowNull: true
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

export default subscriptionModel;
