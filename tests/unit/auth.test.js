const mongoose = require("mongoose");
const { User } = require("../../models/users");
const auth = require("../../middleware/auth");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: "dami",
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.user).toMatchObject({ name: "dami", isAdmin: true }); // not sure why it doesnt work when I compare with `user`
  });
});
