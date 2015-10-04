var express = require('express');
var router = express.Router();

// Setup Twilio
// var accountSid = 'ACcaebeaad7593fb33f0c80283d25da632';
// var authToken = 'e3f30e916c7ef5c759f618d1f90db267';
// var twilio = require('twilio')(accountSid, authToken);

// Setup Database and Model Info
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/gottago.db');

/* GET bathrooms listing. */
router.get('/', function(req, res, next) {
  db.all("SELECT * from bathrooms",function(err,bathrooms){
    if(err) throw new Error(err);
    res.render('bathrooms', { bathrooms: bathrooms });
  })
});

module.exports = router;
