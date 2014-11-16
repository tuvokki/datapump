var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var sensors = require('./routes/sensors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// print request info
app.use(function(req, res, next) {
  // console.log("Printing request info?");
  var end = res.end;
  var time = new Date;
  res.end = function(chunk, encoding){
    res.end = end;
    if (chunk) {
      //the remote ip
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      // console.log('DEV REQ from: ' + ip);
      console.log('[' + time + '] ' + ip);
    }
    res.end(chunk, encoding);
  };
  next();
});

app.use('/', routes);
app.use('/sensors', sensors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Searching rainbows without the sun?');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if (err.status === 404) {
      var message = err.message || 'Itching my unknown places?'
      res.render('notfound', {
        title: 'There is nothing here.',
        message: message + ' No unicorns here, baby...',
        error: err
      });
    }
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

if (!module.parent) {
  app.listen(port, host, function () {
    console.log("Express server listening on port %d in %s mode",
      app.address().port,
      app.settings.env
    );
  });
}

module.exports = app;
