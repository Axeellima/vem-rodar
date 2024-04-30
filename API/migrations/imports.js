// migrations/1711662918707-add_payed_column_to_rides_migration.js

const Rides = require('../src/models/rides');

async function migrate(db) {
   // Adiciona a coluna payed ao modelo de Ride
   await Rides.updateMany({}, { $set: { payed: false } });
   db();
}

module.exports = migrate;
