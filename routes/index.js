var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'The Sensor App' });
});

/* GET interactivedots page. */
router.get('/interactivedots', function(req, res) {
  res.render('interactivedots', { title: 'random values using the Ziggurat algorithm' });
});

/* GET dots page. */
router.get('/dots', function(req, res) {
  res.render('dots', { title: 'random values using the Ziggurat algorithm' });
});

/* GET bars page. */
router.get('/bars', function(req, res) {
  res.render('bars', { title: 'Temperatures in bars' });
});

/* GET bell page. */
router.get('/bell', function(req, res) {
  res.render('bell', { title: 'Just a bell' });
});

/* GET line page. */
router.get('/line', function(req, res) {
  res.render('line', { title: 'Temperature evolves' });
});

/* GET circles page. */
router.get('/circles', function(req, res) {
  res.render('circles', { title: 'Chart circles' });
});

/* GET bounce page. */
router.get('/bounce', function(req, res) {
  res.render('bounce', { title: 'Chart bounce' });
});

/* GET tempdots page. */
router.get('/tempdots', function(req, res) {
  res.render('tempdots', { title: 'Chart tempdots' });
});

module.exports = router;
