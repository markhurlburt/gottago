var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var io = require('socket.io')(server);

var bathrooms = require('./routes/bathrooms');
app.use('/', bathrooms);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup Database and Model Info
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/restrooms';

// Setup Particle.io communications
var spark = require('spark');

// Subscribe to bathroom notifications
spark.on('login', function() {
  spark.onEvent('bathrooms', function(data) {

    // Sample data: {"data":"not_occupied","ttl":"60","published_at":"2015-09-02T04:31:18.577Z","coreid":"2a0036001347343339383037","name":"bathrooms/bit"}
    var bathroom_name = data.name.substring(10);
    var bathroom_status = (data.data == "occupied" ? true : false);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // SQL Query > Update Data
        client.query("UPDATE restrooms SET occupied = $1 WHERE name = $2", [bathroom_status, bathroom_name]);
        // Handle Errors
        if(err) {
          console.log(err);
        }
    });

    // Send updates to listening browsers
    io.emit('occupancy_update', { bathroom: bathroom_name, occupied:bathroom_status });

  });
});

// Login as usual
var promise = spark.login({ username: process.env.PARTICLE_USER || 'mhurlburt@gmail.com', password: process.env.PARTICLE_PASS || 'starwars' });

// ERROR HANDLERS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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

server.listen(process.env.PORT || '3000');
