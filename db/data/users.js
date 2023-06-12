const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = [
  {
    username: "tim",
    email: "tim@gmail.com",
    password_hash: bcrypt.hashSync("tim", saltRounds),
  },
  {
    username: "jim",
    email: "jim@gmail.com",
    password_hash: bcrypt.hashSync("jim", saltRounds),
  },
  {
    username: "george",
    email: "george@gmail.com",
    password_hash: bcrypt.hashSync("george", saltRounds),
  },
  {
    username: "gabriel",
    email: "gabriel@gmail.com",
    password_hash: bcrypt.hashSync("gabriel", saltRounds),
  },
];
