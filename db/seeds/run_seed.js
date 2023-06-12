const db = require("../connection.js");
const parkings = require("../data/parkings.js");
const users = require("../data/users.js");
const seed = require("./seed.js");

const runSeed = () => {
  seed({ users, parkings }).then(() => {
    db.end();
  });
};

runSeed();
