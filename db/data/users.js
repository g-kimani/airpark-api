const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = [
  {
    firstName: "tim",
    lastName: "wentworth",
    username: "tim",
    email: "tim@gmail.com",
    password_hash: bcrypt.hashSync("tim", saltRounds),
  },
  {
    firstName: "jim",
    lastName: "jones",
    username: "jim1",
    email: "jim@gmail.com",
    password_hash: bcrypt.hashSync("jim", saltRounds),
  },
  {
    firstName: "george",
    lastName: "smith",
    username: "george2",
    email: "george@gmail.com",
    password_hash: bcrypt.hashSync("george", saltRounds),
  },
  {
    firstName: "gaberiel",
    lastName: "adams",
    username: "gabriel3",
    email: "gabriel@gmail.com",
    password_hash: bcrypt.hashSync("gabriel", saltRounds),
  },
];
