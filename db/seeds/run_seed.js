const db = require("../connection.js");
const users = require("../data/users.js");
const seed = require("./seed.js");

const runSeed = () => {
  seed({ users }).then(() => {
    db.end();
  });
};

runSeed();
