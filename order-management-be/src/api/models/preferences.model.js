import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

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
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            payment: {
                type: DataTypes.BOOLEAN,
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

export default preferencesModel;
