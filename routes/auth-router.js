const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../db/connection.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("./utils.js");
const { updateParkingById } = require("../models/parking.model.js");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

require("dotenv").config({
  path: `${__dirname}/../.env.auth`,
});

// jwt strategy - for authenticating enpoints
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    // Check if the user exists in the database using the extracted user ID
    db.query("SELECT * FROM users WHERE user_id = $1", [jwtPayload.sub])
      .then(({ rows }) => {
        const user = rows[0];
        if (user) {
          // User found, authentication successful
          delete user.password_hash;
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
  new LocalStrategy(
    { usernameField: "login", passwordField: "password" },
    (login, password, done) => {
      return db
        .query("SELECT * FROM users WHERE email = $1 OR username = $1", [login])
        .then(({ rows }) => {
          const user = rows[0];
          // there shouldn't be more than one user with email or username
          if (!user || rows.length === 0 || rows.length > 1) {
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
    }
  )
);

const authRouter = require("express").Router();

authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).send(req.authInfo);
    }

    const token = generateToken(req.user);

    return res.status(200).send({
      user: req.user.username,
      email: req.user.email,
      token,
    });
  }
);

authRouter.post("/signup", (req, res, next) => {
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

authRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const { user } = req;
    if (!user) {
      return res.status(401).send(req.authInfo);
    }
    return res
      .status(200)
      .send({ user: user.username, email: user.email, user_id: user.user_id });
  }
);

module.exports = authRouter;
