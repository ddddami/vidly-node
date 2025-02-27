const request = require("supertest");
const { Genre } = require("../../models/genres");

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
});
