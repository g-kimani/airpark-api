const { addParkingModel } = require("../models/parking.model");

exports.addParkingController = (req, res) => {
  addParkingModel(req.body).then((parking) => {
    res.status(201).send({ parking });
  });
};
