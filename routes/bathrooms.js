var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/gottago');
var Bathroom = mongoose.model('Bathroom', {name:String, occupied:Boolean});

/* GET bathrooms listing. */
router.get('/', function(req, res, next) {
  return Bathroom.find({},function(err,bathrooms){
    if(err) throw new Error(err);
    res.json(bathrooms);
  })
});

router.patch('/:id', function(req, res, next){
  bathroom = Bathroom.findOne({name:req.params.id},function(err,bathroom) {
    bathroom.occupied = req.body.occupied;
    console.log(bathroom);
    bathroom.save(function(err){
      if(err) throw new Error(err);
      res.json(bathroom);
    });
  });
});

router.post('/', function(request, response, next){
   var bathroom = new Bathroom({name: request.body.name});
   bathroom.save(function(err){
     if(err) throw new Error(err);
      response.send(bathroom.toJSON());
   });
});


module.exports = router;
