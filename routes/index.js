// Import required modules
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var Ticket = require("../model/ticket");
var User = require("../model/user");
// Route to render the home page
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
// Route to render the manage tickets page
router.get("/manage", async (req, res, next) => {
  session = req.cookies.session;
  if ((await User.exists({ sessions: { $in: [session] } })) !== null) {
    var session_user = await User.findOne({ sessions: { $in: [session] } });
    const ticket_list = await Ticket.find({ user: session_user._id });
    // Check the 'edited' and 'deleted' query parameters to determine the render state
    if (req.query.edited == "true") {
      // Render the manage page with an edited success indicator
      res.render("manage", {
        title: "Manage Tickets",
        ticket_list: ticket_list,
        edited: true,
      });
    } else if (req.query.edited == "false") {
      // Render the manage page with an edited failure indicator
      res.render("manage", {
        title: "Manage Tickets",
        ticket_list: ticket_list,
        edited: false,
      });
    } else if (req.query.deleted == "true") {
      // Render the manage page with a deleted success indicator
      res.render("manage", {
        title: "Manage Tickets",
        ticket_list: ticket_list,
        deleted: true,
      });
    } else if (req.query.deleted == "false") {
      // Render the manage page with a deleted failure indicator
      res.render("manage", {
        title: "Manage Tickets",
        ticket_list: ticket_list,
        deleted: false,
      });
    } else {
      // Render the manage page without any edit or delete status
      res.render("manage", {
        title: "Manage Tickets",
        ticket_list: ticket_list,
      });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/register", function (req, res, next) {
  if (req.query.match == "false") {
    res.render("register", { title: "Register", match: false });
  } else {
    res.render("register", { title: "Register" });
  }
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});

module.exports = router;
