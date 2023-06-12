const db = require("../connection.js");
const bcrypt = require("bcrypt");
const format = require("pg-format");

const seed = async () => {
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`
    CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        password_hash BYTEA NOT NULL,
        email VARCHAR NOT NULL
    )`);
  const saltRounds = 10;
  // get sample users and their passwords
  const user1 = "tim";
  const user1Pass = await bcrypt.hash(user1, saltRounds);
  const user2 = "jim";
  const user2Pass = await bcrypt.hash(user2, saltRounds);
  const userQuery = format(
    `
        INSERT INTO users
        (username, password_hash, email)
        VALUES
        %L
    `,
    [
      [user1, user1Pass, "tim@gmail.com"],
      [user2, user2Pass, "jim@gmail.com"],
    ]
  );
  await db.query(userQuery);
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
