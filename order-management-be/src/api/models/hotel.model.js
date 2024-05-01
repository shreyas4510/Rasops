import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const hotelModel = (sequelize) => (
    sequelize.define(TABLES.HOTEL, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        open_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        close_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        care_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        paranoid: true
    })
);

export default hotelModel;
