const sqliteConnection = require("../../sqlite");
const createUsers = require("./createUser");

async function migrationsRun() {
  const schemas = [createUsers].join("");

  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((err) => console.error(err));
}

module.exports = migrationsRun;