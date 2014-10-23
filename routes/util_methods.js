var chance      = require('chance')(72436598176);

var util_methods = function (){
  var lib_version = '1.0.0';

  /* returns the version of this library */
  this.getLibVersion = function() {
    return lib_version;
  }

  /** --Utility methods-- **/
  /**
   * Returns a random boolean
   * In this case only a 30% likelihood of true, and a 70% likelihood of false.
   */
   this.getRandomBool = function(){
    //The default likelihood of success (returning true) is 50%
    return chance.bool({likelihood: 30});
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
   this.getRandomTemp = function(min, max) {
    if (min < 10) min = 10;
    if (max > 30) max = 30;
    return chance.floating({min: min, max: max, fixed: 2}) 
  }
  /** --Utility methods-- **/

  /** CREATE THE SENSORDATA **/
   this.sensor_reading = function(s_id, start_time, end_time, type) {
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

  // n = 6 gives a good enough approximation of a bell curve
  this.rnd2 = function() {
      return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
  }

  /*
   * Returns member of set with a given mean and standard deviation
   * mean: mean
   * standard deviation: std_dev 
   */
  this.createMemberInNormalDistribution = function(mean,std_dev){
      return mean + (gaussRandom()*std_dev);
  }

  /*
   * Returns random number in normal distribution centering on 0.
   * ~95% of numbers returned should fall between -2 and 2
   */
  this.gaussRandom = function() {
      var u = 2*Math.random()-1;
      var v = 2*Math.random()-1;
      var r = u*u + v*v;
      /*if outside interval [0,1] start over*/
      if(r == 0 || r > 1) return gaussRandom();

      var c = Math.sqrt(-2*Math.log(r)/r);
      return u*c;

      /* todo: optimize this algorithm by caching (v*c) 
       * and returning next time gaussRandom() is called.
       */
  }
};

module.exports = util_methods;