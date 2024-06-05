import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

export const MENU_STATUS = ['AVAILABLE', 'UNAVAILABLE'];

const menuModel = (sequelize) =>
    sequelize.define(
        TABLES.MENU,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            categoryId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: TABLES.CATEGORIES,
                    key: 'id'
                }
            },
            hotelId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: TABLES.HOTEL,
                    key: 'id'
                }
            },
            status: {
                type: DataTypes.ENUM,
                values: MENU_STATUS,
                allowNull: false,
                defaultValue: MENU_STATUS[0]
            },
            price: {
                type: DataTypes.FLOAT,
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

export default menuModel;
