const db = require("../db/connection");

exports.createParking = (parking) => {
  return db
    .query(
      `
      INSERT INTO parkings
      (host_id, area, description, location, price, is_booked, picture)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        parking.host_id,
        parking.area,
        parking.description,
        `(${parking.latitude}, ${parking.longitude})`,
        parking.price,
        false,
        parking.picture,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectParkings = ({
  order = "asc",
  host_id,
  ne_lat,
  ne_lng,
  sw_lat,
  sw_lng,
}) => {
  const validOrder = ["asc", "desc"];

  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid query",
    });
  }

  let queryStr = `
    SELECT * 
    FROM parkings 
    WHERE is_booked = false
  `;

  // TODO: Stop usign string interpolation
  if (host_id) {
    queryStr += `AND host_id = ${host_id}`;
  } else {
    queryStr += `
    AND location[0] >= ${sw_lat}
    AND location[0] <= ${ne_lat}
    AND location[1] >= ${sw_lng}
    AND location[1] <= ${ne_lng}
    `;
  }

  queryStr += `ORDER BY price`;

  if (order === "asc" || order === "desc") {
    queryStr += ` ${order.toUpperCase()};`;
  }

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.selectParkingById = (parking_id) => {
  return db
    .query(
      `
      SELECT * FROM parkings
      WHERE parking_id = $1
  `,
      [parking_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "No parking found" });
      } else {
        return rows[0];
      }
    });
};

exports.updateParkingById = (user_id, price, parking_id) => {
  return db
    .query(
      `
      UPDATE parkings
      SET
        price = $1
      WHERE parking_id = $2 AND host_id = $3
      RETURNING *;
  `,
      [price, parking_id, user_id]
    )
    .then(({ rowCount, rows }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, message: "Parking not found" });
      } else {
        return rows[0];
      }
    });
};
