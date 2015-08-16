var express = require('express');
var router = express.Router();

// Setup Database and Model Info
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/gottago');
var Bathroom = mongoose.model('Bathroom', {name:String, occupied:Boolean, description:String, men:Boolean, women:Boolean});

// Setup Twilio
var accountSid = 'ACcaebeaad7593fb33f0c80283d25da632';
var authToken = 'e3f30e916c7ef5c759f618d1f90db267';
var twilio = require('twilio')(accountSid, authToken);

/* GET bathrooms listing. */
router.get('/', function(req, res, next) {
  return Bathroom.find({},function(err,bathrooms){
    if(err) throw new Error(err);
    res.render('bathrooms', { bathrooms: bathrooms });
    // res.json(bathrooms);
  })
});

// UPDATE bathroom occupancy
router.put('/:id', function(req, res, next){
  bathroom = Bathroom.findOne({name:req.params.id},function(err,bathroom) {
    bathroom.occupied = req.body.occupied;
    bathroom.save(function(err){
      if(err) throw new Error(err);
      if(!bathroom.occupied) {
        // TODO: Check if unoccupied and notify anyone in the queue
        // twilio.messages.create({
        //     body: "Gotta go?",
        //     to: "+16127039976",
        //     from: "+19522227346"
        // }, function(err, message) {
        //     if (err) {
        //       process.stdout.write(err.message);
        //     } else {
        //       process.stdout.write(message.sid);
        //     }
        // });
      }
      // Return Bathroom in JSON
      res.json(bathroom);
    });
  });
});

// Method for creating bathrooms (stubbed out)
// router.post('/', function(request, response, next){
//    var bathroom = new Bathroom({name: request.body.name});
//    bathroom.save(function(err){
//      if(err) throw new Error(err);
//       response.send(bathroom.toJSON());
//    });
// });


module.exports = router;
