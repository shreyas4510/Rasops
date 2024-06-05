import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const tableModel = (sequelize) =>
    sequelize.define(
        TABLES.TABLE,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            tableNumber: {
                type: DataTypes.INTEGER,
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
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            paranoid: true
        }
    );

export default tableModel;
