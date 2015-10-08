var express = require('express');
var router = express.Router();

// Setup Twilio
// var accountSid = 'ACcaebeaad7593fb33f0c80283d25da632';
// var authToken = 'e3f30e916c7ef5c759f618d1f90db267';
// var twilio = require('twilio')(accountSid, authToken);

// Setup Database and Model Info
var pg = require('pg');
var connectionString = process.env.DATABASE_URL;

/* GET bathrooms listing. */
router.get('/', function(req, res, next) {
  var results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
      // SQL Query > Select Data
      var query = client.query("SELECT * from restrooms ORDER BY name ASC");
      // Stream results back one row at a time
      query.on('row', function(row) {
          results.push(row);
      });
      // After all data is returned, close connection and return results
      query.on('end', function() {
          client.end();
          // return res.json(results);
          res.render('bathrooms', { bathrooms: results });
      });
      // Handle Errors
      if(err) {
        console.log(err);
      }
  });
});

module.exports = router;
