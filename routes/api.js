var express = require("express");
var router = express.Router();
var ticket = require("../model/ticket");

router.post("/create", async (req, res, next) => {
  try {
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
    res.redirect("/?submitted=true");
  } catch {
    res.redirect("/?submitted=false");
  }
});

router.post("/edit", async (req, res, next) => {
  try {
    var { id, name, email, title, description, type, priority } = req.body;
    await ticket.findByIdAndUpdate(id, {
      name,
      email,
      title,
      description,
      type,
      priority,
    });
    res.redirect("/manage?edited=true");
  } catch {
    res.redirect("/manage?edited=false");
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    await ticket.findByIdAndDelete(req.body.id);
    res.redirect("/manage?deleted=true");
  } catch {
    res.redirect("/manage?deleted=false");
  }
});

module.exports = router;
