var express    = require('express'),
    router     = express.Router(),
    sensorReg  = require('save')('sensor'),
    sensorSpec = require('save')('sensorspecs'),
    sensorData = require('save')('sensordata'),
    moment     = require('moment'),
    range      = require('moment-range'),
    chance     = require('chance')(72436598176)

/** CREATE THE SENSORS **/
_sensorlist = [ {name: "testi", id: 1, active: true,  mintemp: 12, maxtemp: 21},
                {name: "tosti", id: 2, active: true,  mintemp: 14, maxtemp: 23},
                {name: "taart", id: 3, active: false, mintemp: 14, maxtemp: 20}
              ]

_sensorlist.forEach(function(item) { 
  sensorReg.create({ name: item.name, id: item.id, active: item.active }, function (error, user) {
    if (error) console.log("error saving data sensorReg: ", error)
    else
      if (item.id === 2) //a sensor can have multiple spec definitions
        sensorSpec.create({sensor_id: item.id, capabilities: {temp: true, motion: true, video: true}})
      sensorSpec.create({sensor_id: item.id, capabilities: {temp: true, motion: false, video: false}})
  })
})
/** END CREATE THE SENSORS **/

/** --Utility methods-- **/
/**
 * Returns a random boolean
 * In this case only a 30% likelihood of true, and a 70% likelihood of false.
 */
function getRandomBool(){
  //The default likelihood of success (returning true) is 50%
  return chance.bool({likelihood: 30});
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomTemp(min, max) {
  if (min < 10) min = 10;
  if (max > 30) max = 30;
  return chance.floating({min: min, max: max, fixed: 2}) 
}
/** --Utility methods-- **/

/** CREATE THE SENSORDATA **/
function sensor_reading (s_id, start_time, end_time, type) {
  var start = moment(start_time, "MM-DD-YYYY");
  var end   = moment(end_time, "MM-DD-YYYY");
  var retval = [];
  var tmp_temp = getRandomTemp(12,21);
  var alldates = moment().range(start, end);
  alldates.by('hours', function(moment) {
    //iterate the daterange by minute
    tmp_temp = getRandomTemp(tmp_temp-1, tmp_temp+1);

    var tmp_date = moment.format(); //get the date from the moment
    if (type) // TODO: must be temp, we fix this later
      if (type == "temp")
        retval.push({sensor_id: s_id, time: tmp_date, temp: tmp_temp})
      else if (type == "motion")
        retval.push({sensor_id: s_id, time: tmp_date, motion: getRandomBool()})
    else
      retval.push({sensor_id: s_id, time: tmp_date, temp: tmp_temp, motion: getRandomBool(), video: 'stream'})
  });
  return retval;
}

/* GET all readings for this sensor */
router.get('/:id/readings', function(req, res) {
  readings = sensor_reading(req.params.id, "10-09-2014", "10-10-2014"); //MM-DD-YYYY
  res.send(readings)
});

/* GET all readings for this sensor filtered by type */
router.get('/:id/readings/:type', function(req, res) {
  readings = sensor_reading(req.params.id, "10-07-2014", "10-10-2014", req.params.type); //MM-DD-YYYY
  res.send(readings)
});

/* GET list of sensors available. */
router.get('/', function(req, res) {
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
            sensor.specs.push({ set: sspec._id, capabilities: sspec.capabilities})
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
