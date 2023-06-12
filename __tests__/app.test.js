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
