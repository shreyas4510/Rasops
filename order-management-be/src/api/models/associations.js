function defineAssociations(db) {
    // Defaine all tables
    const { users, invites, hotel, hotelUserRelation, tables, categories, menu } = db;

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
}

export default defineAssociations;
