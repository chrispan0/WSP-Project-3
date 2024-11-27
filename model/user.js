// MVC --> Model , View , Controller (Routers)
let mongoose = require("mongoose");
// create a model class
let userModel = new mongoose.Schema({
  email: String,
  password: String,
});
module.exports = mongoose.model("user", userModel);
