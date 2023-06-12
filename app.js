const express = require("express");
// const cors = require("cors");

const app = express();
// app.use(cors);
app.use(express.json());

app.use((req, res, next) => {
  // logs method url and time of any request made
  console.log(
    `REQUEST: ${req.method} | ${req.url} | ${new Date().toISOString()}`
  );
  next();
});

app.get("/api", (req, res) => {
  res.status(200).send({ message: "all ok" });
});

module.exports = app;
