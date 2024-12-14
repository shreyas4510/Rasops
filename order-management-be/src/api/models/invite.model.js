import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

export const INVITE_STATUS = ['PENDING', 'ACCEPTED', 'EXPIRED'];

const inviteModel = (sequelize) =>
    sequelize.define(
        TABLES.INVITE,
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            status: {
                type: DataTypes.ENUM,
                values: INVITE_STATUS,
                allowNull: false
            },
            ownerId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: true,
                references: {
                    model: TABLES.USERS,
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

export default inviteModel;
