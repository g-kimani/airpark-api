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
} = require("../controllers/booking.controller");
const { fileStorage } = require("./storage/file-storage");

const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send({ message: "all ok here" });
});

apiRouter.get("/parkings", getParkings);
apiRouter.post("/parkings", fileStorage.single("picture"), addParking);

apiRouter.get("/parkings/:parking_id", getParkingById);
apiRouter.patch(
  "/parkings/:parking_id",
  passport.authenticate("jwt", { session: false }),
  patchParkingById
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

module.exports = apiRouter;
