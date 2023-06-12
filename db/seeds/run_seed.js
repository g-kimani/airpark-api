const db = require("../connection.js");
const bookings = require("../data/bookings.js");
const parkings = require("../data/parkings.js");
const users = require("../data/users.js");
const seed = require("./seed.js");

const runSeed = () => {
  seed({ users, parkings, bookings }).then(() => {
    db.end();
  });
};

runSeed();
