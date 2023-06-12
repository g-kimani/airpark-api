const db = require("../connection.js");
const bcrypt = require("bcrypt");
const format = require("pg-format");

const seed = async ({ users }) => {
  return db
    .query("DROP TABLE IF EXISTS users;")
    .then(() => db.query("DROP TABLE IF EXISTS parkings;"))
    .then(() =>
      db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password_hash BYTEA NOT NULL
    )`)
    )
    .then(() => {
      const userData = users.map((user) => {
        return [user.username, user.email, user.password_hash];
      });
      const usersQuery = format(
        `
      INSERT INTO users
        (username, email, password_hash)
        VALUES
        %L
      `,
        userData
      );
      return db.query(usersQuery);
    });
};

const createAndSeedParkings = () => {
  return db
    .query(
      `
  CREATE TABLE parkings(
    parking_id SERIAL PRIMARY KEY,
    host_id INT REFERENCES users(user_id),
    location VARCHAR
    price FLOAT
    isBooked BOOLEAN NOT NULL,
  )
  `
    )
    .then(() => {});
};

module.exports = seed;
