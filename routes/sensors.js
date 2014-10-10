var express    = require('express'),
    router     = express.Router(),
    sensorReg  = require('save')('sensor'),
    sensorSpec = require('save')('sensordata')

_sensorlist = [{name: "test", id: 1, active: true},{name: "tosti", id: 2, active: true},{name: "taart", id: 3, active: false}]

_sensorlist.forEach(function(item) { 
  sensorReg.create({ name: item.name, id: item.id, active: item.active }, function (error, user) {
    if (error) console.log("error saving data sensorReg: ", error)
    else
      if (item.id === 2) //a sensor can have multiple spec definitions
        sensorSpec.create({sensor_id: item.id, capabilities: {temp: true, motion: true, video: true}})
      sensorSpec.create({sensor_id: item.id, capabilities: {temp: true, motion: false, video: false}})
  })
})

/* GET list   of sensors available. */
router.get(  '/', function(req, res) {
  sensorReg.find({}, function (error, sensors) {
    if (error) {
      console.log("error fetching data sensorReg: ", error)
      res.status(500).end()
    }
    res.send(sensors)
  })
});

// GET /1 -> return the sensor with id 1
router.get('/:id', function(req, res) {
    console.log(req.params.id);
    //Reads a single entity with an idProperty of id
    sensorReg.read(req.params.id, function (error, sensor) {
    if (error) {
      console.log("error fetching data sensorReg: ", error)
      res.status(500).end()
    }
 
    if (sensor) {
      //found a sensor, now get the specifications for it
      sensorSpec.find({ 'sensor_id': sensor.id }, function(error, sensorspec) {
        if (sensorspec) {
          sensor.specs = []
          sensorspec.forEach(function(sspec) {
            console.log("sspec.capabilities", sspec.capabilities);
            sensor.specs.push(sspec.capabilities)
          })
        }
        // sensor.specs = sensorspec
        res.send(sensor)
      })
    } else {
      res.status(404).end()
    }
  })
});

module.exports = router;
