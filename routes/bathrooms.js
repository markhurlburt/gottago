var express = require('express');
var router = express.Router();

// Setup Twilio
// var accountSid = 'ACcaebeaad7593fb33f0c80283d25da632';
// var authToken = 'e3f30e916c7ef5c759f618d1f90db267';
// var twilio = require('twilio')(accountSid, authToken);

// Setup Database and Model Info
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/gottago.db');

// Create Table if necessary
// db.serialize(function() {
//   db.run("CREATE TABLE if not exists bathrooms (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, occupied INTEGER)");
//   var stmt = db.prepare("INSERT INTO bathrooms (name,occupied) VALUES (?,?)");
//   for (var i = 1; i < 5; i++) {
//       stmt.run("Bathroom " + i, 0);
//   }
//   stmt.finalize();
// });


/* GET bathrooms listing. */
router.get('/', function(req, res, next) {
  db.all("SELECT * from bathrooms",function(err,bathrooms){
    console.log(bathrooms);
    if(err) throw new Error(err);
    res.render('bathrooms', { bathrooms: bathrooms });
  })
});

// // UPDATE bathroom occupancy
// router.put('/:id', function(req, res, next){
//   console.log(req.body.occupied);
//   db.run("UPDATE bathrooms SET occupied = ? WHERE id = ? ",req.body.occupied,req.params.id);
//   res.redirect("/bathrooms");
// });

// Method for creating bathrooms (stubbed out)
// router.post('/', function(request, response, next){
//    var bathroom = new Bathroom({name: request.body.name});
//    bathroom.save(function(err){
//      if(err) throw new Error(err);
//       response.send(bathroom.toJSON());
//    });
// });


module.exports = router;
