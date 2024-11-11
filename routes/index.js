// Import required modules
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var Ticket = require("../model/ticket");
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
// Route to render the ticket editor page
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
// Fetch all tickets from the database
  const ticket_list = await Ticket.find();
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
});

module.exports = router;
