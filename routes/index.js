var express = require('express');
var router = express.Router();

/* GET bars page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'The Sensor App' });
});

/* GET bars page. */
router.get('/bars', function(req, res) {
  res.render('bars', { title: 'Temperatures in bars' });
});

/* GET line page. */
router.get('/line', function(req, res) {
  res.render('line', { title: 'Temperature evolves' });
});

/* GET circles page. */
router.get('/circles', function(req, res) {
  res.render('circles', { title: 'Chart circles' });
});

module.exports = router;
