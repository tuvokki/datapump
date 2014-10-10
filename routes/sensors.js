var express   = require('express'),
    router    = express.Router(),
    sensorReg = require('save')('sensor'),


_sensorlist = [{name: "test", id: 1, active: true},{name: "tosti", id: 2, active: true},{name: "taart", id: 3, active: false}]

_sensorlist.forEach(function(item) { 
  sensorReg.create({ name: item.name, id: item.id, active: item.active }, function (error, user) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  })
})

/* GET list   of sensors available. */
router.get(  '/', function(req, res) {
  sensorReg.find({}, function (error, sensors) {
    res.send(sensors)
  })
  // sensorlist = {};
  // sensorlist.sensors = _sensorlist
  // res.send(sensorlist);
});

// GET /1 -> return the sensor with id 1
router.get('/:id', function(req, res) {
    console.log(req.params.id);
    res.send({sensor: _sensorlist[req.params.id - 1]});
});

module.exports = router;
