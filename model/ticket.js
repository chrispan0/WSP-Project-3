// MVC --> Model , View , Controller (Routers)
let mongoose = require('mongoose')
// create a model class
let ticketModel = new mongoose.Schema({
    name:String,
    email:String,
    title:String,
    description:String,
    type:String,
    priority:Number
}
)
module.exports = mongoose.model('ticket',ticketModel)