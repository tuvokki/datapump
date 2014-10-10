var express = require('express');
var router = express.Router();

/* GET list of sensors available. */
router.get('/', function(req, res) {
  sensorlist = {};
  sensorlist.sensors = [{name: "test", id: 1, active: true},{name: "tosti", id: 2, active: true},{name: "taart", id: 3, active: false}]
  res.send(sensorlist);
});

module.exports = router;
