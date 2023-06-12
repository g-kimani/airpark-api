const { addBookingModel } = require("../models/booking.model");

exports.addBookingController = (req, res) => {
  addBookingModel(req.body).then((booking) => {
    res.status(201).send({ booking });
  });
};
