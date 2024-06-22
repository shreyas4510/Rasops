import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const paymentGatewayEntitiesModel = (sequelize) =>
    sequelize.define(
        TABLES.PAYMENT_GATEWAY_ENTITIES,
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
            accountId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            stakeholderId: {
                type: DataTypes.STRING,
                allowNull: true
            },
            productId: {
                type: DataTypes.STRING,
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

export default paymentGatewayEntitiesModel;
