const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = [
  {
    firstname: "tim",
    lastname: "wentworth",
    username: "tim",
    email: "tim@gmail.com",
    password_hash: bcrypt.hashSync("tim", saltRounds),
    phone_number: "07123456789",
  },
  {
    firstname: "jim",
    lastname: "jones",
    username: "jim1",
    email: "jim@gmail.com",
    password_hash: bcrypt.hashSync("jim", saltRounds),
    phone_number: "07123456789",
  },
  {
    firstname: "george",
    lastname: "smith",
    username: "george2",
    email: "george@gmail.com",
    password_hash: bcrypt.hashSync("george", saltRounds),
    phone_number: "07123456789",
  },
  {
    firstname: "gaberiel",
    lastname: "adams",
    username: "gabriel3",
    email: "gabriel@gmail.com",
    password_hash: bcrypt.hashSync("gabriel", saltRounds),
    phone_number: "07123456789",
  },
  {
    firstname: "Mc",
    lastname: "Lovin",
    username: "McLovin",
    email: "mc@lovin.com",
    password_hash: bcrypt.hashSync("mclovin", saltRounds),
  },
];
