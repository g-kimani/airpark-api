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

exports.selectParkings = (sort_by = "price", order = "asc", area) => {
  const validSortBy = ["price"];
  const validOrder = ["asc", "desc"];

  // if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: "Invalid query",
  //   });
  // }

  let queryStr = `
    SELECT * 
    FROM parkings 
    WHERE is_booked = false 
  `;

  const queryParams = [];

  if (area) {
    queryStr += ` AND area = $1 `;
    queryParams.push(area);
  }

  queryStr += ` ORDER BY ${sort_by}`;

  if (order === "asc" || order === "desc") {
    queryStr += ` ${order.toUpperCase()};`;
  }

  return db.query(queryStr, queryParams).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "No parkings found",
      });
    }
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
