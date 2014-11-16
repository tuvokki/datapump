The data-pump
=============
#####We're gonna * * pump * * you up!#####

The data-pump is a module, wrapped in an express app, that does the following:

* Generate fake sensor data
* Push that data through a websocket

If a websocket is not available the pump generates intermediate data on a per request base (to support long polling). So if you request a sensor reading per second, and do that once every ten seconds you'll get ten readings per request.

### Start DEBUG ###
DEBUG=datapump nodemon ./bin/www
### Start production ###
node ./bin/www

[![Build Status](https://travis-ci.org/tuvokki/datapump.svg?branch=master)](https://travis-ci.org/tuvokki/datapump)
