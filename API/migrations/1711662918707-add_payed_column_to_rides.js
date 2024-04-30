const migrate = require('./imports');

module.exports.up = async function (db) {
   await migrate(db);
};

module.exports.down = async function (db) {
   // Lógica para reverter a migração, se necessário
};
