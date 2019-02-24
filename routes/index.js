var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Authenticate User */
router.get('/authenticate', function(req, res){
    
});

module.exports = router;
