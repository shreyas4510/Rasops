function defineAssociations(db) {
    // Defaine all tables
    const { users, invites, hotel, hotelUserRelation } = db;

    // user and invite associations
    users.hasOne(invites, { foreignKey: 'userId' });
    invites.belongsTo(users, { foreignKey: 'userId' });

    // hotel user relations
    users.hasMany(hotelUserRelation, { foreignKey: 'userId' });
    hotelUserRelation.belongsTo(users, { foreignKey: 'userId' });

    hotel.hasMany(hotelUserRelation, { foreignKey: 'hotelId' });
    hotelUserRelation.belongsTo(hotel, { foreignKey: 'hotelId' });
}

export default defineAssociations;
