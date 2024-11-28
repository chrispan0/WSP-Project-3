// Import required modules
var express = require("express");
var bcrypt = require("bcrypt");
var { randomUUID } = require("crypto");
var router = express.Router();
var ticket = require("../model/ticket");
var user = require("../model/user");
// Route to handle ticket creation
router.post("/create", async (req, res, next) => {
  try {
    // Destructure required fields from request body
    var { title, description, type, priority } = req.body;
    // Create a new ticket instance with provided details
    new_ticket = new ticket({
      user,
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
    var { id, title, description, type, priority } = req.body;
    // Find the ticket by ID and update its details
    await ticket.findByIdAndUpdate(id, {
      user,
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

router.post("/register", async (req, res, next) => {
  try {
    var { name, email, password, confirmpassword } = req.body;
    if (password == confirmpassword) {
      if ((await user.exists({ email: email })) == null) {
        hash = await bcrypt.hash(password, 10);
        new_user = new user({
          name,
          email,
          hash,
        });
        await new_user.save();
      }
      res.redirect("/login");
    } else {
      res.redirect("/register?match=false");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/"); // TODO: ERROR MESSAGE
  }
});

router.post("/login", async (req, res, next) => {
  try {
    var { email, password } = req.body;
    user_id = await user.exists({ email: email });
    if (user_id !== null) {
      login_user = await user.findById(user_id);
      if (bcrypt.compare(password, login_user.hash)) {
        session = randomUUID();
        login_user.sessions.push(session);
        res.cookie({ session: session });
        res.redirect("/manage");
      }
    }
    res.redirect("/login"); // TODO: ERROR MESSAGE
  } catch (err) {
    console.error(err);
    res.redirect("/"); // TODO: ERROR MESSAGE
  }
});

module.exports = router;
