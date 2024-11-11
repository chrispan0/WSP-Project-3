var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var Ticket = require("../model/ticket");

router.get("/", function (req, res, next) {
  res.render("index", { title: "CJB Support" });
});

router.get("/editor", async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.query.id);
    if (ticket) {
      res.render("editor", { title: "Ticket Editor", ticket: ticket });
    } else {
      res.render("editor", { title: "Ticket Editor" });
    }
  } catch {
    res.redirect("/editor");
  }
});

router.get("/manage", async (req, res, next) => {
  const ticket_list = await Ticket.find();
  res.render("manage", {
    title: "Manage Tickets",
    ticket_list: ticket_list,
  });
});

module.exports = router;
