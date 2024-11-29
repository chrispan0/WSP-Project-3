// Import required modules
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var Ticket = require("../model/ticket");
var User = require("../model/user");
// Route to render the home page
router.get("/", async (req, res, next) => {
  session = req.cookies.session;
  if ((await User.exists({ sessions: { $in: [session] } })) !== null) {
    if (req.query.submitted == "true") {
      res.render("index", { title: "CJB Support", submitted: true, loggedinnav: true });
    } else if (req.query.submitted == "false") {
      res.render("index", { title: "CJB Support", submitted: false, loggedinnav: true });
    } else {
      res.render("index", { title: "CJB Support", loggedinnav: true });
    }
  } else {
    if (req.query.submitted == "true") {
      res.render("index", { title: "CJB Support", submitted: true, loggedinnav: false });
    } else if (req.query.submitted == "false") {
      res.render("index", { title: "CJB Support", submitted: false, loggedinnav: false });
    } else {
      res.render("index", { title: "CJB Support", loggedinnav: false });
    }
  }
});
router.get("/editor", async (req, res, next) => {
  session = req.cookies.session;
  if ((await User.exists({ sessions: { $in: [session] } })) !== null) {
  try {
    let ticket = await Ticket.findById(req.query.id);
    if (ticket) {
      res.render("editor", { title: "Ticket Editor", ticket: ticket, loggedinnav: true });
    } else {
      res.render("editor", { title: "Ticket Editor", loggedinnav: true });
    }
  } catch {
    res.redirect("/editor");
  }
} else {
  res.redirect("/login");
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
        title: "Manage Tickets", loggedinnav: true,
        user_list: user_list,
        ticket_list: ticket_list,
        edited: true,
      });
    } else if (req.query.edited == "false") {
      // Render the manage page with an edited failure indicator
      res.render("manage", {
        title: "Manage Tickets", loggedinnav: true,
        user_list: user_list,
        ticket_list: ticket_list,
        edited: false,
      });
    } else if (req.query.deleted == "true") {
      // Render the manage page with a deleted success indicator
      res.render("manage", {
        title: "Manage Tickets", loggedinnav: true,
        user_list: user_list,
        ticket_list: ticket_list,
        deleted: true,
      });
    } else if (req.query.deleted == "false") {
      // Render the manage page with a deleted failure indicator
      res.render("manage", {
        title: "Manage Tickets", loggedinnav: true,
        user_list: user_list,
        ticket_list: ticket_list,
        deleted: false,
      });
    } else {
      // Render the manage page without any edit or delete status
      res.render("manage", {
        title: "Manage Tickets", loggedinnav: true,
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
    res.render("register", { title: "Register", match: false, loggedinnav: false });
  } else if (req.query.registered == "false") {
    res.render("register", { title: "Register", registered: false, loggedinnav: false });
  } else {
    res.render("register", { title: "Register", loggedinnav: false });
  }
});

router.get("/login", function (req, res, next) {
  if (req.query.registered == "true") {
    res.render("login", { title: "Login", registered: true, loggedinnav: false });
  } else if (req.query.loggedin == "false") {
    res.render("login", { title: "Login", loggedin: false, loggedinnav: false });
  } else {
    res.render("login", { title: "Login", loggedinnav: false });
  }
});

module.exports = router;
