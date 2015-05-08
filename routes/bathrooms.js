var express = require('express');
var router = express.Router();

/* GET bathrooms listing. */
router.get('/', function(req, res, next) {
  res.send('Listing of all bathrooms');
});

router.patch('/:id', function(req, res, next){
  res.send('Confirmation that an update happened to bathroom ' + req.params.id);
});

module.exports = router;
