var express      = require('express'),
    router       = express.Router(),
    validator    = require('validator');
    sensorReg    = require('save')('sensor'),
    sensorSpec   = require('save')('sensorspecs'),
    sensorData   = require('save')('sensordata'),
    moment       = require('moment'),
    range        = require('moment-range'),
    Ziggurat     = require('./ziggurat'),
    um_lib       = require('./util_methods'),
    discography  = require('./discography');

var util_methods = new um_lib();

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

function _value_sort_up(a, b) {
  // return the sort
  return a.Value - b.Value;
}

function _value_sort_down(a, b) {
  // return the sort
  return a.Value - b.Value;
}

router.get('/utillib', function(req, res) {
  // var ff = new util_methods();
  res.send({result: util_methods.getLibVersion()});
});

router.get('/kapot500', function(req, res) {
   var err = new Error("Alles kaputt.");
   err.status = 500;
   throw err;
});

router.get('/kapot404', function(req, res) {
   var err = new Error("Alles kaputt.");
   err.status = 404;
   throw err;
});

router.get('/bell/:num', function(req, res) {
  var result = []
  // we start with a nice, randomized set of values
  if (validator.isNumeric(req.params.num)) {
    for (var i = req.params.num - 1; i >= 0; i--) {
      var ff = {
        "All": "all"+i,
        "Number": i,
        "Value": util_methods.rnd2(),
        "Size": util_methods.getRandomTemp(),
        "Side": ""
      }
      result.push(ff)
    };
  }

  //first sort the array
  result.sort(_value_sort_up);
  //split it in two equal parts
  var half_length = Math.ceil(result.length / 2);    
  var leftSide = result.splice(0,half_length).sort(_value_sort_down);
  var rightSide = result.sort(_value_sort_up);
  //create a new empty array that will hold the result
  var bell = [];

  //re-index the left side and filter out all the positive values
  for (var i = 0; i < leftSide.length; i++) {
    if (leftSide[i].Value > 0) {
      leftSide.splice(i,1)
      break;
    }
    //provive a new label
    leftSide[i].Number = i;
    leftSide[i].Side = "left" + i
    //push it to the result array
    bell.push(leftSide[i])
  };

  //re-index the right side and filter out all the negative values
  for (var i = 0; i < rightSide.length; i++) {
    if (rightSide[i].Value < 0) {
      rightSide.splice(i,1)
      break;
    }
    //provive a new label
    rightSide[i].Number = rightSide.length - i;
    rightSide[i].Side = "right" + i
    //push it to the result array
    bell.push(rightSide[i])
  };

  res.send(bell);
});

router.get('/doors', function(req, res) {
  // console.log("util_methods.rnd2()", util_methods.rnd2());
  var z = new Ziggurat();
  var result = []
  var band_members = ["Jim","John","Robbie","Ray"]
  var albums = ["Waiting for the sun","Soft Parade","LA Woman","Morrison Hotel","Strange Days","The Doors"]
  var labels = ["Elektra", "Rhino"]

  for (var i = 5000 - 1; i >= 0; i--) {
    var album = albums[Math.floor(Math.random() * albums.length)];
    var band_member = band_members[Math.floor(Math.random() * band_members.length)];
    var label = labels[Math.floor(Math.random() * labels.length)];
    var ff = {
      "Date": "01/12/2012",
      "Band member": band_member,
      "Album": album,
      "Unit Sales": i,
      "Operating Profit": z.nextGaussian(),
      "Owner": label,
      "Sales Value": i,
      "Price": 100,
    }
    result.push(ff)
  };
  res.send(result);
});

/* GET all readings for this sensor */
router.get('/:id/readings', function(req, res) {
  readings = util_methods.sensor_reading(req.params.id, "10-09-2014", "10-10-2014"); //MM-DD-YYYY
  res.send(readings)
});

/* GET all readings for this sensor filtered by type */
router.get('/:id/readings/:type', function(req, res) {
  readings = util_methods.sensor_reading(req.params.id, "10-07-2014", "10-10-2014", req.params.type); //MM-DD-YYYY
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
router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  //Reads a single entity with an idProperty of id
  sensorReg.read(req.params.id, function (error, sensor) {
    if (error) {
      console.log("error fetching data sensorReg: ", error)
      return next(err)
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
      var err = new Error('Sensor not found.');
      err.status = 404;
      return next(err)
    }
  })
});


module.exports = router;
