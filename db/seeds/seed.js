const db = require("../connection.js");
const bcrypt = require("bcrypt");
const format = require("pg-format");

const seed = async () => {
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`
    CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        password_hash BYTEA NOT NULL
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
        (username, password_hash)
        VALUES
        %L
    `,
    [
      [user1, user1Pass],
      [user2, user2Pass],
    ]
  );
  await db.query(userQuery);
};

module.exports = seed;
