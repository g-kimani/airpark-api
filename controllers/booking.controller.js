const {
  createBooking,
  selectBookingsForUser,
  selectBookingById,
} = require("../models/booking.model");

exports.addBooking = (req, res, next) => {
  const { user_id } = req.user;
  const newBooking = { ...req.body, traveller_id: user_id };
  createBooking(newBooking)
    .then((booking) => {
      res.status(201).send({ booking });
    })
    .catch((err) => next(err));
};

exports.getBookingsForUser = (req, res, next) => {
  const { user_id } = req.user;
  selectBookingsForUser(user_id)
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch((err) => next(err));
};

exports.getBookingById = (req, res, next) => {
  const { user_id } = req.user;
  const { booking_id } = req.params;
  selectBookingById(user_id, booking_id)
    .then((booking) => {
      res.status(200).send({ booking });
    })
    .catch((err) => next(err));
};
