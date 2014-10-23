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

function value_sort_up(a, b) {
    return a.Value - b.Value;
}
function value_sort_down(a, b) {
    return a.Value - b.Value;
}

router.get('/bell/:num', function(req, res) {
  // console.log("req.params.num", req.params.num);
  var result = []
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
  // var sortedresult = result.sort(value_sort_up);
  // for (var i = sortedresult.length - 1; i >= 0; i--) {
  //   sortedresult[i].Number = i
  // };
  result.sort(value_sort_up);
  var half_length = Math.ceil(result.length / 2);    
  // console.log("half_length", half_length);
  // console.log("result.length", result.length);
  var leftSide = result.splice(0,half_length).sort(value_sort_down);
  // console.log("leftSide", leftSide);
  var rightSide = result.sort(value_sort_up);
  // console.log("rightSide", rightSide);

  var bell = [];

  for (var i = 0; i < leftSide.length; i++) {
  // for (var i = leftSide.length - 1; i >= 0; i--) {
    if (leftSide[i].Value >= 0) {
      leftSide.splice(i,1)
      break;
    }
    leftSide[i].Number = i;
    leftSide[i].Side = "left" + i
    bell.push(leftSide[i])
  };

  // for (var i = rightSide.length - 1; i >= 0; i--) {
  for (var i = 0; i < rightSide.length; i++) {
    if (rightSide[i].Value <= 0) {
      rightSide.splice(i,1)
      break;
    }
    rightSide[i].Number = rightSide.length - i;
    rightSide[i].Side = "right" + i
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

router.get('/utillib', function(req, res) {
  // var ff = new util_methods();
  res.send({result: util_methods.getLibVersion()});
});


module.exports = router;
