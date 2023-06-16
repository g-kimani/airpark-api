const {
  createParking,
  selectParkings,
  selectParkingById,
  updateParkingById: updateParkingByIdModel,
} = require("../models/parking.model");
const { uploadImage } = require("../routes/storage/upload-file");

exports.addParking = (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  uploadImage(file)
    .then((url) => {
      return createParking({
        ...req.body,
        host_id: req.user.user_id,
        picture: url,
      });
    })
    .then((parking) => {
      res.status(201).send({ parking });
    })
    .catch((err) => next(err));
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
