var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
router.get('/ticket', function(req, res, next) {
  res.render('ticket', { title: 'Ticket Editor' });
});
router.get('/product', function(req, res, next) {
  res.render('index', { title: 'Ticket Manager' });
});

module.exports = router;
