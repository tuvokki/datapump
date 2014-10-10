var express = require('express');
var router = express.Router();

/* GET list of sensors available. */
router.get('/', function(req, res) {
  sensorlist = {};
  sensorlist.sensors = [{name: "test", id: 1, active: true}]
  res.send(sensorlist);
  //res.send('respond with a resource');
});

module.exports = router;
