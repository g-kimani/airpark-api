const express = require("express");
const cors = require("cors");
const passport = require("passport");

const authRouter = require("./routes/auth-router.js");
const apiRouter = require("./routes/api-router.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// api logger
app.use((req, res, next) => {
  // logs method url and time of any request made
  console.log(
    `REQUEST: ${req.method} | ${req.url} | ${new Date().toISOString()}`
  );
  next();
});

app.use("/", authRouter);

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log("Error :", err);
  res.status(err.status).send({ message: err.message });
  next();
});

module.exports = app;
