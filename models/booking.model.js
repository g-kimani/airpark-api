const db = require("../db/connection.js");

exports.createBooking = (booking) => {
  return db
    .query(
      `
    INSERT INTO bookings
    (traveller_id, parking_id, booking_start, booking_end, price, status)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
      [
        booking.traveller_id,
        booking.parking_id,
        booking.booking_start,
        booking.booking_end,
        booking.price,
        booking.status ?? "pending",
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectBookingsForUser = (user_id) => {
  return db
    .query("SELECT * FROM bookings WHERE traveller_id = $1", [user_id])
    .then(({ rows }) => rows);
};

exports.selectBookingById = (user_id, booking_id) => {
  return db
    .query(
      `
      SELECT * FROM bookings
      WHERE traveller_id = $1 AND booking_id = $2`,
      [user_id, booking_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "No booking found" });
      } else {
        return rows[0];
      }
    });
};

exports.selectBookingsByParking = (user_id, parking_id) => {
  return db
    .query(
      `
    SELECT bookings.* FROM bookings
    JOIN parkings
    ON bookings.parking_id = parkings.parking_id
    WHERE parkings.parking_id=$1 AND host_id=$2
  `,
      [parking_id, user_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.updateBookingStatus = (user_id, booking_id, status) => {
  return db
    .query(
      `
      UPDATE bookings
      SET
          status = $1
      FROM parkings
      WHERE bookings.parking_id = parkings.parking_id
      AND
          bookings.booking_id = $2
      AND
          parkings.host_id = $3
      RETURNING bookings.*

  `,
      [status, booking_id, user_id]
    )
    .then((result) => {
      if (status.toLowerCase() === "confirmed") {
        return db
          .query(
            `
          UPDATE parkings
          SET
            is_booked = $1
          WHERE parking_id = $2
        `,
            [true, result.rows[0].parking_id]
          )
          .then(() => {
            return result.rows[0];
          });
      }
      return result.rows[0];
    });
};
