var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var Ticket = require("../model/ticket");

router.get("/", function (req, res, next) {
  if (req.query.submitted == "true") {
    res.render("index", { title: "CJB Support", submitted: true });
  } else if (req.query.submitted == "false") {
    res.render("index", { title: "CJB Support", submitted: false });
  } else {
    res.render("index", { title: "CJB Support" });
  }
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
  if (req.query.edited == "true") {
    res.render("manage", {
      title: "Manage Tickets",
      ticket_list: ticket_list,
      edited: true,
    });
  } else if (req.query.edited == "false") {
    res.render("manage", {
      title: "Manage Tickets",
      ticket_list: ticket_list,
      edited: false,
    });
  } else if (req.query.deleted == "true") {
    res.render("manage", {
      title: "Manage Tickets",
      ticket_list: ticket_list,
      deleted: true,
    });
  } else if (req.query.deleted == "false") {
    res.render("manage", {
      title: "Manage Tickets",
      ticket_list: ticket_list,
      deleted: false,
    });
  } else {
    res.render("manage", {
      title: "Manage Tickets",
      ticket_list: ticket_list,
    });
  }
});

module.exports = router;
