var express = require("express");
var authRoutes = require("./routes/auth-routes");
var router = express.Router();

router.get("/github", async (req, res, next) => {
    res.send('Logging In with Github');
  res.send()
  });

  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }), async (req, res, next) => {
    res.send('Logging In with Google');
  res.send())

  module.exports = router