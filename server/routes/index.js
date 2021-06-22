const bcrypt = require("bcryptjs");

const { check, oneOf, validationResult } = require("express-validator");

const verifyRegistrationData = require("./verifyRegistrationData.js");

const verifyLoginData = require("./verifyLoginData.js");

const ObjectId = require("mongodb").ObjectId;

const { google } = require("googleapis");

const axios = require("axios");

const fs = require("fs").promises;

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const express = require('express');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

require("dotenv").config();

const stripe = require("stripe")(process.env.SECRET_KEY);

const postCharge = require("./stripe");

module.exports = function (app, db) {
	app.post("/stripe/charge", postCharge);

	app.post("/edit", async (req, res) => {
		const data = {};

		if (req.body.picture) {
			let base64String = req.body.picture;
			let base64Image = base64String.split(";base64,");
			let image = base64Image.pop();
			let extention = base64Image.pop();
			extention =
				"." +
				extention.slice(extention.indexOf("/") + 1, extention.length);

			const current_date = new Date().valueOf().toString();
			const random = Math.random().toString();
			const fileName = crypto
				.createHash("md5")
				.update(current_date + random)
				.digest("hex");

			path = __dirname + "/../uploads/" + fileName + extention;
			data.picture = "./uploads/" + fileName + extention;

			fs.writeFile(path, image, { encoding: "base64" }, function (err) {
				if (err) {
					throw err;
				}
			});
		}

		if (req.body.username) {
			data.username = req.body.username;
		}

		if (req.body.age) {
			data.age = req.body.age;
		}

		if (!(JSON.stringify(data) === "{}"))
			try {
				db.collection("user").updateOne(
					{ _id: new ObjectId(req.session.userId) },
					{ $set: data },
					function (err, result) {
						if (err) {
							throw err;
						}
						res.send("success");
					}
				);
			} catch {
				res.send("fail");
			}
		else {
			res.send("fail");
		}
	});

	app.get("/products", (req, res) => {
		db.collection("product")
		.find()
		.toArray()
		.then((result) => {
			res.send(result);
		});
	});

	app.get("/search", (req, res) => {	
		const query = {}

		
		if(req.query.type) query.type = req.query.type
		
		if(req.query.text)
			query.$text = { $search: req.query.text }

		const products = db.collection("product").find(query)
		
		if(req.query.text)
			products.sort( { score: { $meta: "textScore" } } )
		products.toArray()
		.then((result) => {
			res.send(result);
		})
	})

	app.post("/products", authenticateToken, authorizeAdmin,
		async (req, res) => {
			const product = req.body.product;
			try {
				await db.collection("product").insertOne(product);
				res.sendStatus(201).json();
			} catch (err) {
				res.sendStatus(500);
			}
		}
	);

	app.post("/signup", verifyRegistrationData(db, check), async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const { username, email, password } = req.body;

		const salt = bcrypt.genSaltSync(12);

		const hash = bcrypt.hashSync(password, salt);

		try {
			const result = await createUser(db, username, email, hash);
			req.session.userId = result.ops[0]._id;
			req.session.save();
			res.redirect(201, "/dashboard");
		} catch (err) {
			res.redirect(500, "/registration");
		}
	});

	app.post("/login", verifyLoginData(db, check, oneOf), (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json(errors.array());
		}

		errors = [];

		const { email_user, password } = req.body;

		db.collection("user")
			.findOne(
				{ $or: [{ email: email_user }, { username: email_user }] })
			.then((result) => {
				const user = result;

				const salt = bcrypt.getSalt(user.password);
				const hash = bcrypt.hashSync(password, salt);

				if (user.email == email_user || user.username == email_user) {
					if (user.password === hash) {
						const token = generateAccessToken({
							email_user: req.body.email_user,
							role: user.role,
						});
						res.json({ accessToken: token });
						return;
					}
				}
				errors.push({
					msg: "Credentials didn't match our records.",
					param: "credentials",
					location: "body",
				});
				return res.status(422).json(errors);
			});
	});

	app.post("/create-checkout-session", async (req, res) => {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: extractPriceData(req.body),
			mode: "payment",
			success_url:
				"http://localhost:3001/order/success?session_id={CHECKOUT_SESSION_ID}",
			cancel_url: "http://localhost:3000/cart",
		});
		res.json({ id: session.id });
	});
	
	app.get("/order/success", (req, res) => {
		console.log(req.params)
		res.redirect("http://localhost:3000/order/success")
	})
	
	app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
		const sig = req.headers['stripe-signature'];
	
		let event;
	
		try {
			event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
		} catch (err) {
			console.log(err);
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}
	
		console.log(event)

		if (event.type === 'checkout.session.completed') {
			AddPurchaseToHistory(event);
		}

		response.status(200);
	});

	return app;
};

function extractPriceData(cart) {
	return Object.values(cart || {}).map((product) => {
		return {
			price_data: {
				currency: "usd",
				product_data: {
					name: product.product.name,
				},
				unit_amount: product.product.price * 100,
			},
			quantity: product.amount,
		};
	});
}

function createUser(db, username, email, hash) {
	return db.collection("user").insertOne({ username, email, password });
}

function generateAccessToken(payload) {
	return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "7d" });
}

function authenticateToken(req, res, next) {
	const token = req.headers["authorization"];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

function authorizeAdmin(req, res, next) {
	if (req.user.role != "admin") return res.sendStatus(403);
	next();
}

const AddPurchaseToHistory = (event) => {
	// TODO: fill me in
	console.log("Fulfilling order", event);
}