const passport = require("passport");
const {
  getParkings,
  addParking,
  getParkingById,
  patchParkingById,
} = require("../controllers/parking.controller");
const {
  getBookingsForUser,
  addBooking,
  getBookingById,
  getBookingsForParking,
  patchBookingStatus,
} = require("../controllers/booking.controller");
const multer = require("multer");

const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send({ message: "all ok here" });
});

apiRouter.get("/parkings", getParkings);
apiRouter.post(
  "/parkings",
  passport.authenticate("jwt", { session: false }),
  multer().single("picture"),
  addParking
);

apiRouter.get("/parkings/:parking_id", getParkingById);
apiRouter.patch(
  "/parkings/:parking_id",
  passport.authenticate("jwt", { session: false }),
  patchParkingById
);

apiRouter.get(
  "/parkings/:parking_id/bookings",
  passport.authenticate("jwt", { session: false }),
  getBookingsForParking
);

apiRouter.get(
  "/bookings",
  passport.authenticate("jwt", { session: false }),
  getBookingsForUser
);
apiRouter.post(
  "/bookings",
  passport.authenticate("jwt", { session: false }),
  addBooking
);

apiRouter.get(
  "/bookings/:booking_id",
  passport.authenticate("jwt", { session: false }),
  getBookingById
);
apiRouter.patch(
  "/bookings/:booking_id/status",
  passport.authenticate("jwt", { session: false }),
  patchBookingStatus
);

module.exports = apiRouter;
