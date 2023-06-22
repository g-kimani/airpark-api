const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../db/connection.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("./utils.js");
const { updateParkingById } = require("../models/parking.model.js");
const multer = require("multer");
const { uploadImage } = require("./storage/upload-file.js");

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
          done(null, false, { message: "user not found" });
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
      user_id: req.user.user_id,
      token,
    });
  }
);

authRouter.post("/signup", (req, res, next) => {
  const { username, password, email, firstname, lastname } = req.body;
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
            (username, password_hash, email, firstname, lastname)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING user_id, username, email, firstname, lastname;
          `,
              [username, password_hash, email, firstname, lastname]
            );
          })
          .then(({ rows }) => {
            const newUser = rows[0];
            const token = generateToken(newUser);
            res.status(201).send({
              user: newUser.username,
              user_id: newUser.user_id,
              token,
            });
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
    return res.status(200).send({
      user: user.username,
      email: user.email,
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      avatar_url: user.avatar_url,
    });
  }
);

authRouter.patch(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  multer().single("avatar"),
  async (req, res, next) => {
    const { user, file, body } = req;
    let avatarUrl = "";
    if (file) {
      avatarUrl = await uploadImage(file);
    }
    db.query(
      `
      UPDATE users
      SET
        firstname = $1,
        lastname = $2,
        username = $3,
        email = $4,
        avatar_url = $5
      WHERE
        user_id = $6
      RETURNING firstname, lastname, username, email, user_id, avatar_url
    `,
      [
        body.firstname,
        body.lastname,
        body.username,
        body.email,
        avatarUrl,
        user.user_id,
      ]
    )
      .then((result) => {
        const user = result.rows[0];
        res.status(200).send({ user });
      })
      .catch((err) => next(err));
  }
);

module.exports = authRouter;
