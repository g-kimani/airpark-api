const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const users = require("../db/data/users.js");
const parkings = require("../db/data/parkings.js");
const bookings = require("../db/data/bookings.js");
require("jest-sorted");

afterAll(() => connection.end());
beforeEach(() => seed({ users, parkings, bookings }));

describe("/api", () => {
  test("GET - status 200 - responds with a message all ok", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { message } = response.body;
        expect(message).toBe("all ok here");
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

describe("GET /api/parkings", () => {
  test("STATUS 200: responds with an array of all the article objects, by default sorted by price in descending order ", () => {
    return request(app)
      .get("/api/parkings")
      .expect(200)
      .then((response) => {
        const { parkings } = response.body;
        expect(parkings).toBeInstanceOf(Array);
        expect(parkings).toBeSortedBy("price", {
          descending: true,
        });
        parkings.forEach((parking) => {
          expect(parking).toMatchObject({
            parking_id: expect.any(Number),
            host_id: expect.any(Number),
            area: expect.any(String),
            // description: expect.any(String) || expect.toEqual(null),
            location: expect.any(Object),
            price: expect.any(Number),
            is_booked: expect.any(Boolean),
          });
        });
      });
  });
  test("STATUS 200 - responds with an array of parkings in ascending order when order is specified", () => {
    return request(app)
      .get("/api/parkings?order=asc")
      .expect(200)
      .then((response) => {
        const { parkings } = response.body;
        expect(parkings).toBeSortedBy("price", {
          descending: false,
        });
      });
  });
  test("STATUS 200 - responds with an array of parkings with the specified area property", () => {
    return request(app)
      .get("/api/parkings?area=London")
      .expect(200)
      .then((response) => {
        const { parkings } = response.body;
        parkings.forEach((parking) => {
          expect(parking.area).toBe("London");
        });
      });
  });
  test("STATUS 404 - Responds with error message when there are no parkings with specified area property", () => {
    return request(app)
      .get("/api/parkings?area=Manchester")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No parkings found");
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
