const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const users = require("../db/data/users.js");
const parkings = require("../db/data/parkings.js");

afterAll(() => connection.end());
beforeEach(() => seed({ users, parkings }));

describe("/api", () => {
  test("GET - status 200 - responds with a message all ok", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { message } = response.body;
        expect(message).toBe("all ok");
      });
  });
});

describe("auth", () => {
  describe("login", () => {
    test("POST - status 200 - responds with username and user token", () => {
      return request(app)
        .post("/login")
        .send({
          username: "tim@gmail.com",
          password: "tim",
        })
        .expect(200)
        .then((response) => {
          const { user, email, token } = response.body;
          expect(user).toBe("tim");
          expect(email).toBe("tim@gmail.com");
          expect(typeof token).toBe("string");
        });
    });
    test("POST - status 401 - responds with error if email does not exist", () => {
      return request(app)
        .post("/login")
        .send({ username: "fake@fake.com", password: "fake" })
        .expect(401)
        .then((response) => {
          const { message } = response.body;
          expect(message).toBe("Incorrect email or password");
        });
    });
    test("POST - status 401 - responds with error if password is incorrect for email", () => {
      return request(app)
        .post("/login")
        .send({ username: "tim@gmail.com", password: "fake" })
        .expect(401)
        .then((response) => {
          const { message } = response.body;
          expect(message).toBe("Incorrect email or password");
        });
    });
  });
});

describe("/api/parkings", () => {
  test("GET - status 200 - responds with an array of parkings", () => {
    return request(app)
      .get("/api/parkings")
      .then((response) => {
        const { parkings } = response.body;
        expect(parkings.length).toBe(4);
        parkings.map((parking) => {
          expect(typeof parking.parking_id).toBe("number");
          expect(typeof parking.host_id).toBe("number");
          expect(typeof parking.location).toBe("object"); // TODO : research type for location
          expect(typeof parking.price).toBe("number");
          expect(typeof parking.is_booked).toBe("boolean");
        });
      });
  });
  test("POST - status 201 - responds with username and user token", () => {
    return request(app)
      .post("/api/parkings")
      .send({
        host_id: 4,
        location: "KT5 3SD",
        price: 1.9,
        is_booked: false,
      })
      .expect(201)
      .then((response) => {
        const { parking_id, host_id, location, price, is_booked } =
          response.body.parking;
        expect(typeof parking_id).toBe("number");
        expect(host_id).toBe(4);
        expect(location).toBe("KT5 3SD");
        expect(price).toBe(1.9);
        expect(is_booked).toBe(false);
      });
  });
});
