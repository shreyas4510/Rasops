import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import hotelUserRelationRepo from '../repositories/hotelUserRelation.repository.js';
import inviteRepo from '../repositories/invite.repository.js';
import userRepo from '../repositories/user.repository.js';
import { CustomError } from '../utils/common.js';

const fetch = async (payload) => {
    try {
        const { owner, limit, skip, sortKey, sortOrder, filterKey, filterValue } = payload;
        const defaults = {
            sortKey: 'updatedAt',
            sortOrder: 'DESC',
            limit: 10,
            offset: 0
        };

        const options = {
            where: {
                status: 'ACCEPTED',
                ownerId: owner
            },
            include: [
                {
                    model: db.users,
                    include: [
                        {
                            model: db.hotelUserRelation,
                            attributes: ['hotelId'],
                            include: [
                                {
                                    model: db.hotel,
                                    attributes: ['id', 'name']
                                }
                            ]
                        }
                    ]
                }
            ],
            limit: Number(limit) || defaults.limit,
            offset: Number(skip) || defaults.offset
        };

        const hotelKey = 'hotelName';
        if (sortKey === hotelKey) {
            options.order = [[{ model: db.hotel }, 'name', sortOrder || defaults.sortOrder]];
        }

        if (filterKey === hotelKey && filterValue) {
            options.include[0].include[0].include[0].where = {
                name: {
                    [Op.like]: `%${filterValue}%`
                }
            };
        }

        if (sortKey && sortOrder) {
            options.order = [[{ model: db.users }, sortKey || defaults.sortKey, sortOrder || defaults.sortOrder]];
        }

        if (filterKey && filterValue) {
            options.include[0].where = {
                [filterKey]: {
                    [Op.like]: `%${filterValue}%`
                }
            };
        }

        logger('debug', `Fetching manager with options ${JSON.stringify(options)}`);
        const data = await inviteRepo.find(options);

        logger('debug', `Managers fetched successfully ${data}`);
        const managers = data.rows.reduce((cur, next) => {
            const { user } = next;
            const obj = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                status: user.status,
                createdAt: user.createdAt,
                hotel: {}
            };

            if (user.hotelUserRelations && user.hotelUserRelations.length) {
                obj.hotel = {
                    id: user.hotelUserRelations[0]?.hotel?.id,
                    name: user.hotelUserRelations[0]?.hotel?.name
                };
            }
            cur.push(obj);
            return cur;
        }, []);

        return { count: data.count, rows: managers };
    } catch (error) {
        logger('error', 'Error while fetching managers', { error });
        throw CustomError(error.code, error.message);
    }
};

const update = async (prevHotel, currentHotel, manager) => {
    try {
        if (prevHotel) {
            const hotelOptions = {
                where: {
                    hotelId: prevHotel,
                    userId: manager
                }
            };
            await hotelUserRelationRepo.remove(hotelOptions);
            logger('debug', `${prevHotel} hotel manager unassigned`);
        }

        if (currentHotel) {
            const options = {
                id: uuidv4(),
                hotelId: currentHotel,
                userId: manager
            };

            logger('debug', `${currentHotel} hotel manager assigned`);
            const relation = await hotelUserRelationRepo.save([options]);
            return { data: relation[0] };
        }

        return { message: 'Manager updated successfully' };
    } catch (error) {
        logger('error', 'Error while updating manager', { error });
        throw CustomError(error.code, error.message);
    }
};

const remove = async (managerId) => {
    try {
        const options = {
            where: { userId: managerId }
        };
        await inviteRepo.remove(options);
        logger('debug', `Invite record removed for ${managerId}`);

        await hotelUserRelationRepo.remove(options);
        logger('debug', `Hotel and user relation removed for ${managerId}`);

        const userOptions = {
            where: { id: managerId }
        };
        await userRepo.remove(userOptions);
        logger('debug', `User removed for ${managerId}`);

        return { message: 'User removed successfully' };
    } catch (error) {
        logger('error', 'Error while removing manager', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    fetch,
    update,
    remove
};
