var express = require('express');
var router = express.Router();

_sensorlist = [{name: "test", id: 1, active: true},{name: "tosti", id: 2, active: true},{name: "taart", id: 3, active: false}]

/* GET list of sensors available. */
router.get('/', function(req, res) {
  sensorlist = {};
  sensorlist.sensors = _sensorlist
  res.send(sensorlist);
});

// GET /1 -> return the sensor with id 1
router.get('/:id', function(req, res) {
    console.log(req.params.id);
    res.send({sensor: _sensorlist[req.params.id - 1]});
});

module.exports = router;
