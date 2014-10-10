var express    = require('express'),
    router     = express.Router(),
    sensorReg  = require('save')('sensor'),
    sensorSpec = require('save')('sensorspecs'),
    sensorData = require('save')('sensordata'),
    moment     = require('moment'),
    range      = require('moment-range')

/** CREATE THE SENSORS **/
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
/** END CREATE THE SENSORS **/

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  if (min < 12) min = 12;
  if (max < 21) max = 21;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** CREATE THE SENSORDATA **/
// moment().format();

/*
Iterate over your date range by an amount of time or another range:

var start = new Date(2012, 2, 1);
var two   = new Date(2012, 2, 2);
var end   = new Date(2012, 2, 5);
var range1 = moment().range(start, end);
var range2 = moment().range(start, two); // One day
var acc = [];

range1.by('days', function(moment) {
  // Do something with `moment`
});
Any of the units accepted by moment.js' add method may be used.

You can also iterate by another range:

range1.by(range2, function(moment) {
  // Do something with `moment`
  acc.push(moment);
});

acc.length == 5 // true
*/
function sensor_reading (s_id, start_time, end_time, type) {
  var start = moment(start_time, "MM-DD-YYYY");
  var end   = moment(end_time, "MM-DD-YYYY");
  var retval = [];
  var tmp_temp = getRandomInt(12,21);
  var alldates = moment().range(start, end);
  alldates.by('minutes', function(moment) {
    //iterate the daterange by minute
    tmp_temp = getRandomInt(tmp_temp-1, tmp_temp+1);
    // var tmp_date = moment.get('year') + "-" + moment.get('month') + "-" + moment.get('date') + "T" + moment.get('hour') + ":" + moment.get('minute') + ":00Z";
    //2005-07-08T00:00:00Z
    var tmp_date = moment.format();
    if (type) // TODO: must be temp, we fix this later
      retval.push({time: tmp_date, temp: tmp_temp})
    else
      retval.push({time: tmp_date, temp: tmp_temp, motion: true, video: 'stream'})
  });
  return retval;
}

/* GET all readings for this sensor */
router.get('/:id/readings', function(req, res) {
  readings = sensor_reading(2, "10-09-2014", "10-10-2014"); //MM-DD-YYYY
  res.send(readings)
});

/* GET all readings for this sensor filtered by type */
router.get('/:id/readings/:type', function(req, res) {
  readings = sensor_reading(2, "10-09-2014", "10-10-2014", req.params.type); //MM-DD-YYYY
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
