function defineAssociations(db) {
    // Defaine all tables
    const { users, invites, hotel, hotelUserRelation, tables, categories, menu, preferences, customer } = db;

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
}

export default defineAssociations;
