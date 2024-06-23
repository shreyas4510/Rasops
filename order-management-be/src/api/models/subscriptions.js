import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

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
            startDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            endDate: {
                type: DataTypes.DATE,
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
