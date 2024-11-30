// Import required modules
var express = require("express");
var router = express.Router();
var Ticket = require("../model/ticket");
var User = require("../model/user");
// Route to render the home page
router.get("/", async (req, res, next) => {
  let session = req.cookies.session;
  let loggedin = false;
  if ((await User.exists({ sessions: { $in: [session] } })) !== null) {
    loggedin = true;
  }
  let alerts = [];
  if (req.query.submitted == "true") {
    alerts.push("ticket_submitted");
  } else if (req.query.submitted == "false") {
    alerts.push("ticket_not_submitted");
  }
  res.render("index", {
    title: "CJB Support",
    loggedin: loggedin,
    alerts: alerts,
  });
});

router.get("/editor", async (req, res, next) => {
  let session = req.cookies.session;
  if ((await User.exists({ sessions: { $in: [session] } })) !== null) {
    let ticket = null;
    try {
      ticket = await Ticket.findById(req.query.id);
    } catch {
      res.redirect("/editor");
    }
    res.render("editor", {
      title: "Ticket Editor",
      ticket: ticket,
      loggedin: true,
    });
  } else {
    res.redirect("/login");
  }
});
// Route to render the manage tickets page
router.get("/manage", async (req, res, next) => {
  let session = req.cookies.session;
  if ((await User.exists({ sessions: { $in: [session] } })) !== null) {
    let session_user = await User.findOne({ sessions: { $in: [session] } });
    let ticket_list = null;
    if (session_user.admin) {
      ticket_list = await Ticket.find();
    } else {
      ticket_list = await Ticket.find({ user: session_user._id });
    }
    // Loop through the list of tickets
    let user_list = [];
    for (let i = 0; i < ticket_list.length; i++) {
      let ticket_user = await User.findById(ticket_list[i].user);
      if (ticket_user !== null) {
        user_list.push([ticket_user.name, ticket_user.email]);
      } else {
        user_list.push(["Deleted User", "Deleted User"]);
      }
    }

    let alerts = [];
    // Check the 'edited' and 'deleted' query parameters to determine the render state
    if (req.query.edited == "true") {
      // Render the manage page with an edited success indicator
      alerts.push("ticket_edited");
    } else if (req.query.edited == "false") {
      // Render the manage page with an edited failure indicator
      alerts.push("ticket_not_edited");
    } else if (req.query.deleted == "true") {
      // Render the manage page with a deleted success indicator
      alerts.push("ticket_deleted");
    } else if (req.query.deleted == "false") {
      // Render the manage page with a deleted failure indicator
      alerts.push("ticket_not_deleted");
    }
    res.render("manage", {
      title: "Manage Tickets",
      loggedin: true,
      user_list: user_list,
      ticket_list: ticket_list,
      alerts: alerts,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/register", function (req, res, next) {
  let alerts = [];
  if (req.query.match == "false") {
    alerts.push("user_confirm_password");
  } else if (req.query.registered == "false") {
    alerts.push("user_not_registered");
  }
  res.render("register", {
    title: "Register",
    alerts: alerts,
    loggedin: false,
  });
});

router.get("/login", function (req, res, next) {
  let alerts = [];
  if (req.query.registered == "true") {
    alerts.push("user_registered");
  } else if (req.query.loggedin == "false") {
    alerts.push("user_not_loggedin");
  }
  res.render("login", {
    title: "Login",
    loggedin: false,
    alerts: alerts,
  });
});

module.exports = router;
