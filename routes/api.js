var express = require("express");
var router = express.Router();
var ticket = require("../model/ticket");

router.post("/create", async (req, res, next) => {
  var { name, email, title, description, type, priority } = req.body;
  new_ticket = new ticket({
    name,
    email,
    title,
    description,
    type,
    priority,
  });
  await new_ticket.save();
  res.redirect("/");
});

router.post("/edit", async (req, res, next) => {
  var { id, name, email, title, description, type, priority } = req.body;
  await ticket.findByIdAndUpdate(id, {
    name,
    email,
    title,
    description,
    type,
    priority,
  });
  res.redirect("/");
});

router.post("/delete", async (req, res, next) => {
  await ticket.findByIdAndDelete(req.body.id);
  res.redirect("/manage");
});

module.exports = router;
