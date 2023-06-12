const db = require("../connection.js");
const seed = require("./seed.js");

const runSeed = async () => {
  await seed();
  db.end();
};

runSeed();
