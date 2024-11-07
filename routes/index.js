var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var ticket = require("../model/ticket");
var fetch = require("node-fetch");

const SECRET_KEY = process.env.CF_Secret_Key;

router.get("/", function (req, res, next) {
  res.render("index", { title: "Home" });
});

router.get("/ticket", function (req, res, next) {
  res.render("ticket", {
    title: "Ticket Editor",
    siteKey: process.env.CF_Site_Key,
  });
});

router.get("/manage", async (req, res, next) => {
  const ticket_list = await ticket.find();
  res.render("manage", {
    title: "Manage Tickets",
    ticket_list: ticket_list,
  });
});

router.post("/create", async (req, res, next) => {
  try {
    var {
      name,
      email,
      title,
      description,
      type,
      priority,
      "cf-turnstile-response": token,
    } = req.body;

    const formData = new URLSearchParams();
    formData.append("secret", SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", req.ip);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();

    if (!result.success) {
      return res
        .status(400)
        .send(
          `Verification failed: ${
            result["error-codes"].join(", ") || "Unknown error"
          }`
        );
    }

    new_ticket = new ticket({
      id: crypto.randomUUID(),
      name,
      email,
      title,
      description,
      type,
      priority,
    });

    await new_ticket.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error creating ticket:", error);
    next(error);
  }
});

module.exports = router;
