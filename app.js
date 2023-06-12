const express = require("express");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("./db/connection.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("./utils.js");
const {
  addParkingController,
  getParkingsController,
} = require("./controllers/parking.controller.js");
const { addBookingController } = require("./controllers/booking.controller.js");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

require("dotenv").config({
  path: `${__dirname}/.env.auth`,
});

const app = express();
// app.use(cors);
app.use(express.json());
app.use(passport.initialize());
app.use((req, res, next) => {
  // logs method url and time of any request made
  console.log(
    `REQUEST: ${req.method} | ${req.url} | ${new Date().toISOString()}`
  );
  next();
});

// jwt strategy - for authenticating enpoints
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    console.log(jwtPayload);
    // Check if the user exists in the database using the extracted user ID
    db.query("SELECT * FROM users WHERE user_id = $1", [jwtPayload.sub])
      .then(({ rows }) => {
        const user = rows[0];
        if (user) {
          // User found, authentication successful
          done(null, user);
        } else {
          // User not found, authentication failed
          done(null, false);
        }
      })
      .catch((err) => {
        done(err);
      });
  })
);

// local strategy - login email / password
passport.use(
  new LocalStrategy((email, password, done) => {
    return db
      .query("SELECT * FROM users WHERE email = $1", [email])
      .then(({ rows }) => {
        const user = rows[0];
        if (!user || rows.length === 0) {
          return done(null, false, {
            message: "Incorrect email or password",
          });
        }
        bcrypt
          .compare(password, user.password_hash.toString())
          .then((passwordValid) => {
            if (passwordValid) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Incorrect email or password",
              });
            }
          });
      })
      .catch((err) => {
        done(err);
      });
  })
);

app.get("/api", (req, res) => {
  res.status(200).send({ message: "all ok" });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    const token = generateToken(user);

    return res
      .status(200)
      .send({ user: user.username, email: user.email, token });
  })(req, res, next);
});

app.get("/profile", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    return res
      .status(200)
      .send({ user: user.username, email: user.email, user_id: user.user_id });
  })(req, res, next);
});

app.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  db.query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows }) => {
      if (rows.length > 0) {
        res.status(409).send({ message: "username already exists" });
      } else {
        return db.query("SELECT * FROM users WHERE email=$1", [email]);
      }
    })
    .then(({ rows }) => {
      if (rows.length > 0) {
        res.status(409).send({ message: "email already exists" });
      } else {
        // TODO : research bcrypt salt rounds
        bcrypt
          .hash(password, 10)
          .then((password_hash) => {
            return db.query(
              `
            INSERT INTO users
            (username, password_hash, email)
            VALUES
            ($1, $2, $3)
            RETURNING user_id, username, email;
          `,
              [username, password_hash, email]
            );
          })
          .then(({ rows }) => {
            const newUser = rows[0];
            const token = generateToken(newUser);
            res.status(201).send({ user: newUser.username, token });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

app.post("/api/parkings", addParkingController);
app.get("/api/parkings", getParkingsController);

app.post("/api/bookings", addBookingController);

app.use((err, req, res, next) => {
  console.log("Error :", err);
  next();
});

module.exports = app;
