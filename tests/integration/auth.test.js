const request = require("supertest");
const { User } = require("../../models/users");
const { Genre } = require("../../models/genres");

describe("auth middleware", () => {
	let token;

	beforeAll(async () => {
		server = require("../../index");
	});
	beforeEach(async () => {
		token = new User().generateAuthToken();
	});

	afterEach(async () => {
		await Genre.deleteMany();
		await server.close(); // there's some weirdness with async & await here. it's not even supposed to be awaited, but there is this weird error if it isnt.. should look into this
	});

	const exec = function () {
		return request(server)
			.post("/api/genres") //  a req to a random service that requires auth
			.set("x-auth-token", token)
			.send({ name: "genre1" });
	};

	it("should return 401 if no token is provided", async () => {
		token = ""; // null is converted to "null"
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it("should return 400 if token is invalid", async () => {
		token = "invalid_token";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	// it("should return 200 if token is valid", async () => {
	// 	const res = await exec();
	//
	// 	expect(res.status).toBe(200);
	// });
});
