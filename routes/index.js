var express = require('express');
var router = express.Router();
var Poll = require('../models').Poll;

/* GET home page. */
router.get('/', function(req, res, next) {
  Poll.find({}, function(err, polls){
    if(err){
      throw err;
    }else{
      res.render('index', {
        user: req.user,
        polls: polls
      });
    }});
});

module.exports = router;
