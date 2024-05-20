import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const categoryModel = (sequelize) =>
    sequelize.define(
        TABLES.CATEGORIES,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            hotelId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: TABLES.HOTEL,
                    key: 'id'
                }
            },
            arrangement: {
                type: DataTypes.INTEGER,
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

export default categoryModel;
