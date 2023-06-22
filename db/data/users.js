const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = [
  {
    firstname: "tim",
    lastname: "wentworth",
    username: "tim",
    email: "tim@gmail.com",
    password_hash: bcrypt.hashSync("tim", saltRounds),
  },
  {
    firstname: "jim",
    lastname: "jones",
    username: "jim1",
    email: "jim@gmail.com",
    password_hash: bcrypt.hashSync("jim", saltRounds),
  },
  {
    firstname: "george",
    lastname: "smith",
    username: "george2",
    email: "george@gmail.com",
    password_hash: bcrypt.hashSync("george", saltRounds),
  },
  {
    firstname: "gaberiel",
    lastname: "adams",
    username: "gabriel3",
    email: "gabriel@gmail.com",
    password_hash: bcrypt.hashSync("gabriel", saltRounds),
  },
];
