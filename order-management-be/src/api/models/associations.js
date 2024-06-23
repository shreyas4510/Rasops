function defineAssociations(db) {
    // Defaine all tables
    const {
        users,
        invites,
        hotel,
        hotelUserRelation,
        tables,
        categories,
        menu,
        preferences,
        customer,
        orders,
        pushSubscriptions,
        notifications,
        paymentGatewayEntities,
        subscriptions
    } = db;

    // user and invite associations
    users.hasOne(invites, { foreignKey: 'userId' });
    invites.belongsTo(users, { foreignKey: 'userId' });

    // hotel user relations
    users.hasMany(hotelUserRelation, { foreignKey: 'userId' });
    hotelUserRelation.belongsTo(users, { foreignKey: 'userId' });

    hotel.hasMany(hotelUserRelation, { foreignKey: 'hotelId' });
    hotelUserRelation.belongsTo(hotel, { foreignKey: 'hotelId' });

    // hotel and tables associations
    hotel.hasMany(tables, { foreignKey: 'hotelId' });
    tables.belongsTo(hotel, { foreignKey: 'hotelId' });

    // hotel categories relation
    hotel.hasMany(categories, { foreignKey: 'hotelId' });
    categories.belongsTo(hotel, { foreignKey: 'hotelId' });

    // menu categories relation
    categories.hasMany(menu, { foreignKey: 'categoryId' });
    menu.belongsTo(categories, { foreignKey: 'categoryId' });

    hotel.hasMany(menu, { foreignKey: 'hotelId' });
    menu.belongsTo(hotel, { foreignKey: 'hotelId' });

    // user and preferences relation
    users.hasOne(preferences, { foreignKey: 'userId' });
    preferences.belongsTo(users, { foreignKey: 'userId' });

    // hotel and customer relation
    hotel.hasMany(customer, { foreignKey: 'hotelId' });
    customer.belongsTo(hotel, { foreignKey: 'hotelId' });

    // table and customer relation
    customer.hasOne(tables, { foreignKey: 'customerId' });
    tables.belongsTo(customer, { foreignKey: 'customerId' });

    // order and customer relation
    customer.hasMany(orders, { foreignKey: 'customerId' });
    orders.belongsTo(customer, { foreignKey: 'customerId' });

    // order and menu relation
    menu.hasMany(orders, { foreignKey: 'menuId' });
    orders.belongsTo(menu, { foreignKey: 'menuId' });

    // pushSubscriptions and user relation
    users.hasOne(pushSubscriptions, { foreignKey: 'userId' });
    pushSubscriptions.belongsTo(users, { foreignKey: 'userId' });

    // notification and user relation
    users.hasOne(notifications, { foreignKey: 'userId' });
    notifications.belongsTo(users, { foreignKey: 'userId' });

    // paymentGatewayEntities and user relation
    users.hasOne(paymentGatewayEntities, { foreignKey: 'userId' });
    paymentGatewayEntities.belongsTo(users, { foreignKey: 'userId' });
    // notification and user relation
    hotel.hasOne(subscriptions, { foreignKey: 'hotelId' });
    subscriptions.belongsTo(hotel, { foreignKey: 'hotelId' });
}

export default defineAssociations;
