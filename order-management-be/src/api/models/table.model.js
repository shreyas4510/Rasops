import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const TABLE_STATUS = ['OPEN', 'BOOKED'];

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
            status: {
                type: DataTypes.ENUM,
                values: TABLE_STATUS,
                allowNull: false,
                defaultValue: TABLE_STATUS[0]
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
