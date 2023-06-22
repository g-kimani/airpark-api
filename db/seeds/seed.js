const db = require("../connection.js");
const bcrypt = require("bcrypt");
const format = require("pg-format");

const seed = ({ users, parkings, bookings }) => {
  return db
    .query("DROP TABLE IF EXISTS bookings;")
    .then(() => db.query("DROP TABLE IF EXISTS parkings;"))
    .then(() => db.query("DROP TABLE IF EXISTS users;"))
    .then(() =>
      db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password_hash BYTEA NOT NULL,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        avatar_url VARCHAR
        
    )`)
    )
    .then(() => {
      return db.query(
        `
      CREATE TABLE parkings(
        parking_id SERIAL PRIMARY KEY,
        host_id INT REFERENCES users(user_id),
        area VARCHAR NOT NULL,
        description VARCHAR,
        picture VARCHAR,
        location POINT NOT NULL,
        price FLOAT,
        is_booked BOOLEAN NOT NULL
      )
      `
      );
    })
    .then(() => {
      return db.query(`
      CREATE TABLE bookings(
        booking_id SERIAL PRIMARY KEY,
        traveller_id INT REFERENCES users(user_id),
        parking_id INT REFERENCES parkings(parking_id),
        status VARCHAR,
        booking_start DATE NOT NULL,
        booking_end DATE NOT NULL,
        price FLOAT
      )
      `);
    })
    .then(() => {
      const userData = users.map((user) => {
        return [
          user.username,
          user.email,
          user.password_hash,
          user.firstname,
          user.lastname,
        ];
      });
      const usersQuery = format(
        `
      INSERT INTO users
        (username, email, password_hash, firstname, lastname)
        VALUES
        %L
      `,
        userData
      );
      return db.query(usersQuery);
    })
    .then(() => {
      const parkingData = parkings.map((parking) => {
        return [
          parking.host_id,
          parking.area,
          null,
          `(${parking.location.lat}, ${parking.location.long})`,
          parking.price,
          parking.is_booked,
          parking.picture,
        ];
      });
      const parkingQuery = format(
        `
      INSERT INTO parkings
        (host_id,area, description, location, price, is_booked, picture)
        VALUES
        %L
      `,
        parkingData
      );
      return db.query(parkingQuery);
    })
    .then(() => {
      const bookingData = bookings.map((booking) => {
        return [
          booking.traveller_id,
          booking.parking_id,
          booking.booking_start,
          booking.booking_end,
          booking.price,
        ];
      });
      const bookingQuery = format(
        `
        INSERT INTO bookings
        (traveller_id, parking_id, booking_start, booking_end, price)
        VALUES
        %L
      `,
        bookingData
      );
      return db.query(bookingQuery);
    });
};

module.exports = seed;
