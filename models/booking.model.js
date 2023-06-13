const db = require("../db/connection.js");

exports.addBookingModel = (booking) => {
  return db
    .query(
      `
    INSERT INTO bookings
    (traveller_id, parking_id, booking_start, booking_end, price)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
    `,
      [
        booking.traveller_id,
        booking.parking_id,
        booking.booking_start,
        booking.booking_end,
        booking.price,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.getBookingsForUserModel = (user_id) => {
  return db
    .query("SELECT * FROM bookings WHERE traveller_id = $1", [user_id])
    .then(({ rows }) => rows);
};

exports.getBookingByIdModel = (user_id, booking_id) => {
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
