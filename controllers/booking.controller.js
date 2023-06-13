const {
  addBookingModel,
  getBookingsForUserModel,
  getBookingByIdModel,
} = require("../models/booking.model");

exports.addBookingController = (req, res, next) => {
  const { user_id } = req.user;
  const newBooking = { ...req.body, traveller_id: user_id };
  addBookingModel(newBooking)
    .then((booking) => {
      res.status(201).send({ booking });
    })
    .catch((err) => next(err));
};

exports.getBookingsForUserController = (req, res, next) => {
  const { user_id } = req.user;
  getBookingsForUserModel(user_id)
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch((err) => next(err));
};

exports.getBookingByIdController = (req, res, next) => {
  const { user_id } = req.user;
  const { booking_id } = req.params;
  getBookingByIdModel(user_id, booking_id)
    .then((booking) => {
      res.status(200).send({ booking });
    })
    .catch((err) => next(err));
};
