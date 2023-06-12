const {
  addParkingModel,
  getParkingsModel,
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
