const {
  addParkingModel,
  getParkingsModel,
  getParkingByIdModel,
  updateParkingByIdModel,
} = require("../models/parking.model");

exports.addParkingController = (req, res) => {
  addParkingModel(req.body).then((parking) => {
    res.status(201).send({ parking });
  });
};

exports.getParkingsController = (req, res) => {
  getParkingsModel().then((parkings) => {
    res.status(200).send({ parkings });
  });
};

exports.getParkingByIdController = (req, res, next) => {
  const { parking_id } = req.params;
  console.log(parking_id);
  getParkingByIdModel(parking_id)
    .then((parking) => {
      res.status(200).send({ parking });
    })
    .catch((err) => next(err));
};

exports.updateParkingByIdController = (req, res, next) => {
  const { price } = req.body
  const { parking_id } = req.params
  const { user_id } = req.user
  updateParkingByIdModel(user_id, price, parking_id).then((parking) => {
    res.status(200).send({parking})
  }).catch((err) => next(err) );
}