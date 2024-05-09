import { DataTypes } from 'sequelize';
import { TABLES } from '../utils/common.js';

const hotelUserRelationModel = (sequelize) =>
	sequelize.define(
		TABLES.HOTEL_USER_RELATION,
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
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
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

export default hotelUserRelationModel;
