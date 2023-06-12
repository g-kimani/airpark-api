const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed.js");

afterAll(() => connection.end());
beforeEach(() => seed());

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
