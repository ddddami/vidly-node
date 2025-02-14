const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLenght: 6,
    maxLenght: 255,
  },
  email: {
    type: String,
    required: true,
    minLenght: 6,
    maxLenght: 255,
    unique: true,
  },
  password: { type: String, required: true, minLenght: 6, maxLenght: 1024 },
});

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().required().min(6).max(255),
  });

  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
