const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

let server;

const testGenres = [{ name: "genre1" }, { name: "genre2" }];

describe("/api/genres", () => {
  beforeEach(async () => {
    server = require("../../index");
    // note: Each time test re-runs(watch), it inserts the genres into the db. as a best practice, afterEach, clean up the db/ whatever you did. (already in global setup)
    await Genre.insertMany(testGenres);
  });

  afterEach(async () => {
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty("name");
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if genre is not found", async () => {
      const res = await request(server).get("/api/genres/INVALID");
      expect(res.status).toBe(400);
    });

    it("should return a genre with a given valid ID", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: genre._id.toString(),
        name: genre.name,
      });
      console.log(res.body);
    });
  });

  describe("POST /", () => {
    it("should return 401 if client is unathenticated", async () => {
      const res = await request(server).post("/api/genres").send({
        name: "genre1",
      });
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than three chars", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "12" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 chars", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "a".repeat(50 + 1) });
      expect(res.status).toBe(400);
    });

    it("should the genre if it is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.status).toBe(201);
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the valid if it is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
