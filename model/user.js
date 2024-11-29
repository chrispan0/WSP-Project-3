// MVC --> Model , View , Controller (Routers)
let mongoose = require("mongoose");
// create a model class
let userModel = new mongoose.Schema({
  name: String,
  email: String,
  hash: String,
  admin: Boolean,
  sessions: [String],
});
module.exports = mongoose.model("user", userModel);
