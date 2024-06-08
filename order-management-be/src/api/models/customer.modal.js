import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const customerModel = (sequelize) =>
    sequelize.define(
        TABLES.CUSTOMER,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            feedback: {
                type: DataTypes.STRING,
            },
            rating: {
                type: DataTypes.INTEGER
            },
            hotelId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: TABLES.HOTEL,
                    key: 'id'
                }
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

export default customerModel;
