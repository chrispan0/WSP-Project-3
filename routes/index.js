var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
router.get('/ticket', function(req, res, next) {
  res.render('ticket', { title: 'Ticket Editor' });
});
router.get('/manage', function(req, res, next) {
  res.render('manage', { title: 'Ticket Manager' });
});

module.exports = router;
