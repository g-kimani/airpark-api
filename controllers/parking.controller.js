const {
  createParking,
  selectParkings,
  selectParkingById,
  updateParkingById: updateParkingByIdModel,
} = require("../models/parking.model");

exports.addParking = (req, res) => {
  createParking({ ...req.body }).then((parking) => {
    res.status(201).send({ parking });
  });
};

exports.getParkings = (req, res) => {
  selectParkings().then((parkings) => {
    res.status(200).send({ parkings });
  });
};

exports.getParkingById = (req, res, next) => {
  const { parking_id } = req.params;
  selectParkingById(parking_id)
    .then((parking) => {
      res.status(200).send({ parking });
    })
    .catch((err) => next(err));
};

exports.patchParkingById = (req, res, next) => {
  const { price } = req.body;
  const { parking_id } = req.params;
  const { user_id } = req.user;
  console.log("🚀 ~ file: parking.controller.js:33 ~ user_id:", user_id);

  updateParkingByIdModel(user_id, price, parking_id)
    .then((parking) => {
      res.status(200).send({ parking });
    })
    .catch((err) => next(err));
};
