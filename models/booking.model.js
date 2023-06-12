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
