var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var ticket = require('../model/ticket');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
router.get('/ticket', function(req, res, next) {
  res.render('ticket', { title: 'Ticket Editor' });
});
router.get('/manage', function(req, res, next) {
  res.render('manage', { title: 'Ticket Manager' });
});
router.post('/create', async(req, res, next) => {
  var {name,email,title,description,type,priority} = req.body;
  new_ticket = new ticket({id:crypto.randomUUID(),name,email,title,description,type,priority});
  await new_ticket.save();
  res.redirect('/');
});

module.exports = router;
