const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const { Customer, validate } = require("../models/customers");

const router = express.Router();

router.get("/", async (req, res) => {
	const customers = await Customer.find();
	res.send(customers);
});

router.get("/:id", validateObjectId(), async (req, res) => {
	const customer = await Customer.findById(req.params.id);
	if (!customer) return res.status(404).send("Customer not found");
	res.send(customer);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const customer = await Customer.create({
		name: req.body.name,
		phone: req.body.phone,
		isGold: req.body.isGold,
	});
	res.send(customer);
});

router.put("/:id", validateObjectId(), async (req, res) => {
	const { error } = validate(req.body);

	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const customer = await Customer.findByIdAndUpdate(req.params.id, {
		name: req.body.name,
	});
	if (!customer) return res.status(404).send("Customer not found");

	customer.name = req.body.name;
	res.send(customer);
});

router.delete("/:id", validateObjectId(), async (req, res) => {
	const genre = await Customer.findByIdAndDelete({ _id: req.params.id });
	if (!genre) return res.status(404).send("Customer not found!");
	res.send("Customer deleted");
});

module.exports = router;
