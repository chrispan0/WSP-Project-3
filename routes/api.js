// Import required modules
var express = require("express");
var router = express.Router();
var ticket = require("../model/ticket");
// Route to handle ticket creation
router.post("/create", async (req, res, next) => {
  try {
// Destructure required fields from request body
    var { name, email, title, description, type, priority } = req.body;
// Create a new ticket instance with provided details
    new_ticket = new ticket({
      name,
      email,
      title,
      description,
      type,
      priority,
    });
// Save the new ticket to the database
    await new_ticket.save();
// Redirect to the home page with a success indicator
    res.redirect("/?submitted=true");
  } catch {
// Redirect to the home page with a failure indicator if an error occurs
    res.redirect("/?submitted=false");
  }
});
// Route to handle ticket editing
router.post("/edit", async (req, res, next) => {
  try {
// Destructure required fields from request body
    var { id, name, email, title, description, type, priority } = req.body;
// Find the ticket by ID and update its details
    await ticket.findByIdAndUpdate(id, {
      name,
      email,
      title,
      description,
      type,
      priority,
    });
// Redirect to the management page with a success indicator
    res.redirect("/manage?edited=true");
  } catch {
// Redirect to the management page with a failure indicator if an error occurs
    res.redirect("/manage?edited=false");
  }
});
// Route to handle ticket deletion
router.post("/delete", async (req, res, next) => {
  try {
 // Find the ticket by ID and delete it from the database
    await ticket.findByIdAndDelete(req.body.id);
// Redirect to the management page with a success indicator
    res.redirect("/manage?deleted=true");
  } catch {
// Redirect to the management page with a failure indicator if an error occurs
    res.redirect("/manage?deleted=false");
  }
});

module.exports = router;
