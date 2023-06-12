const db = require("../db/connection");

exports.addParkingModel = (parking) => {
  return db
    .query(
      `
  INSERT INTO parkings
  (host_id, location, price, is_booked)
  VALUES
  ($1, $2, $3, $4) RETURNING *`,
      [parking.host_id, parking.location, parking.price, parking.is_booked]
    )
    .then(({ rows }) => {
      console.log(rows, "model");
      return rows[0];
    });
};
