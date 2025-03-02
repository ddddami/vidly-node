const express = require("express");
const Joi = require("joi");
const validateObjectId = require("../middleware/validateObjectId");
const { Genre } = require("../models/genres");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const router = express.Router();

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(genre);
}

// router.get("/", async (req, res) => {
// 	try {
// 		res.send(await Genre.find());
// 	} catch (err) {
// 		console.error("An unexpected error occured", err); // log the ex
// 		res.status(500).send("An unexpected error occured");
// 	}
// }); // Using an errorMiddleware instead

// router.get("/", async (req, res, next) => {
// 	try {
// 		res.send(await Genre.find());
// 	} catch (err) {
// 		next(err);
// 	}
// });

router.get("/", async (req, res) => {
  res.send(await Genre.find());
});

router.get("/:id", validateObjectId(), async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.create({ name: req.body.name });
  res.status(201).send(genre);
});

router.put("/:id", validateObjectId(), async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });
  if (!genre) return res.status(404).send("Genre not found");

  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", validateObjectId(), auth, admin, async (req, res) => {
  const genre = await Genre.findByIdAndDelete({ _id: req.params.id });
  if (!genre) return res.status(404).send("Genre not found!");
  res.send("Genre deleted");
});

module.exports = router;
