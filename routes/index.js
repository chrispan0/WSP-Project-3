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
    if (session_user.admin) {
      var ticket_list = await Ticket.find();
    } else {
      var ticket_list = await Ticket.find({ user: session_user._id });
    }
    // Loop through the list of tickets
    var user_list = [];
    for (var i = 0; i < ticket_list.length; i++) {
      var ticket_user = await User.findById(ticket_list[i].user);
      user_list.push([ticket_user.name, ticket_user.email]);
    }
    // Check the 'edited' and 'deleted' query parameters to determine the render state
    if (req.query.edited == "true") {
      // Render the manage page with an edited success indicator
      res.render("manage", {
        title: "Manage Tickets",
        user_list: user_list,
        ticket_list: ticket_list,
        edited: true,
      });
    } else if (req.query.edited == "false") {
      // Render the manage page with an edited failure indicator
      res.render("manage", {
        title: "Manage Tickets",
        user_list: user_list,
        ticket_list: ticket_list,
        edited: false,
      });
    } else if (req.query.deleted == "true") {
      // Render the manage page with a deleted success indicator
      res.render("manage", {
        title: "Manage Tickets",
        user_list: user_list,
        ticket_list: ticket_list,
        deleted: true,
      });
    } else if (req.query.deleted == "false") {
      // Render the manage page with a deleted failure indicator
      res.render("manage", {
        title: "Manage Tickets",
        user_list: user_list,
        ticket_list: ticket_list,
        deleted: false,
      });
    } else {
      // Render the manage page without any edit or delete status
      res.render("manage", {
        title: "Manage Tickets",
        user_list: user_list,
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
  } else if (req.query.registered == "false") {
    res.render("register", { title: "Register", registered: false });
  } else {
    res.render("register", { title: "Register" });
  }
});

router.get("/login", function (req, res, next) {
  if (req.query.registered == "true") {
    res.render("login", { title: "Login", registered: true });
  } else if (req.query.loggedin == "false") {
    res.render("login", { title: "Login", loggedin: false });
  } else {
    res.render("login", { title: "Login" });
  }
});

module.exports = router;
