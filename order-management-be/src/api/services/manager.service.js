import { Op, Sequelize, literal } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { INVITE_STATUS } from '../models/invite.model.js';
import hotelUserRelationRepo from '../repositories/hotelUserRelation.repository.js';
import inviteRepo from '../repositories/invite.repository.js';
import userRepo from '../repositories/user.repository.js';
import { CustomError, TABLES } from '../utils/common.js';

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
                status: INVITE_STATUS[1],
                ownerId: owner
            },
            include: [
                {
                    model: db.users,
                    required: true,
                    include: [
                        {
                            model: db.hotelUserRelation,
                            attributes: ['hotelId'],
                            include: [
                                {
                                    model: db.hotel,
                                    attributes: ['id', 'name']
                                }
                            ],
                            separate: true
                        }
                    ]
                }
            ],
            limit: Number(limit) || defaults.limit,
            offset: Number(skip) || defaults.offset
        };

        const hotelKey = 'hotelName';
        if (filterKey && filterValue) {
            if (filterKey === hotelKey) {
                const hotelOptions = {
                    model: db.hotelUserRelation,
                    attributes: ['hotelId'],
                    required: true,
                    where: {
                        hotelId: {
                            [Op.in]: literal(`(SELECT id FROM ${TABLES.HOTEL} WHERE name LIKE '%${filterValue}%')`)
                        }
                    },
                    include: [
                        {
                            model: db.hotel,
                            attributes: ['id', 'name']
                        }
                    ]
                };
                options.include[0].include[0] = hotelOptions;
            } else if (filterKey === 'name') {
                const [firstName, lastName] = filterValue.trim().split(' ');
                options.include[0].where = {};
                if (firstName?.length) {
                    options.include[0].where.firstName = {
                        // eslint-disable-next-line no-useless-escape
                        [Op.like]: Sequelize.literal(`\'%${firstName}%\'`)
                    };
                }

                if (lastName?.length) {
                    options.include[0].where.lastName = {
                        // eslint-disable-next-line no-useless-escape
                        [Op.like]: Sequelize.literal(`\'%${lastName}%\'`)
                    };
                }
            } else {
                options.include[0].where = {
                    [filterKey]: {
                        // eslint-disable-next-line no-useless-escape
                        [Op.like]: Sequelize.literal(`\'%${filterValue}%\'`)
                    }
                };
            }
        }

        options.order = [[{ model: db.users }, defaults.sortKey, defaults.sortOrder]];
        if (sortKey && sortOrder && sortKey !== hotelKey) {
            if (sortKey === 'name') {
                options.order = [[{ model: db.users }, 'firstName', sortOrder || defaults.sortOrder]];
            } else {
                options.order = [[{ model: db.users }, sortKey || defaults.sortKey, sortOrder || defaults.sortOrder]];
            }
        }

        logger('debug', `Fetching manager with options`, options);
        const data = await inviteRepo.find(options);

        logger('debug', `Managers fetched successfully`, data);
        let managers = data.rows.reduce((cur, next) => {
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

        // On purpose done as invite and hotel dont have association so order by not working
        if (sortKey === hotelKey) {
            managers = managers.sort((a, b) => {
                const hotelA = a.hotel?.name?.toLowerCase() || '';
                const hotelB = b.hotel?.name?.toLowerCase() || '';
                if ((sortOrder || defaults.sortKey).toLowerCase() === 'asc') {
                    return hotelA.localeCompare(hotelB);
                } else if ((sortOrder || defaults.sortKey).toLowerCase() === 'desc') {
                    return hotelB.localeCompare(hotelA);
                }
                return 0;
            });
        }
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

const getAssignable = async (ownerId, filter) => {
    try {
        const limit = 25;
        const options = {
            where: {
                ownerId,
                status: INVITE_STATUS[1]
            },
            include: [
                {
                    model: db.users,
                    where: {
                        id: {
                            [Op.notIn]: literal(
                                `(SELECT userId FROM ${TABLES.HOTEL_USER_RELATION} WHERE deletedAt IS NULL)`
                            )
                        }
                    }
                }
            ],
            limit
        };

        if (filter) {
            const condition = {
                [Op.or]: [
                    {
                        firstName: {
                            // eslint-disable-next-line no-useless-escape
                            [Op.like]: Sequelize.literal(`\'%${filter}%\'`)
                        }
                    },
                    {
                        lastName: {
                            // eslint-disable-next-line no-useless-escape
                            [Op.like]: Sequelize.literal(`\'%${filter}%\'`)
                        }
                    }
                ]
            };
            options.include[0].where = {
                ...options.include[0].where,
                ...condition
            };
        }
        logger('debug', `Fetching assignable managers with options ${JSON.stringify(options)}`);

        const invites = await inviteRepo.find(options);
        logger('info', `Fetched assignable managers ${JSON.stringify(invites)}`);

        const rows = invites.rows.map((item) => ({
            id: item.user.id,
            name: `${item.user.firstName} ${item.user.lastName}`
        }));

        return { count: invites.count, rows };
    } catch (error) {
        logger('error', `Error while fetching assignable managers ${JSON.stringify(error)}`);
        throw CustomError(error.code, error.message);
    }
};

export default {
    fetch,
    update,
    remove,
    getAssignable
};
