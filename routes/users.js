var express = require('express');
var router = express.Router();

var User = require('../models/index').User;

router.get('/', ensureAuthenticated, function(req, res){
    User.findOne({_id: req.user._id}).populate('polls').exec(function(err, user){
        if(err){
            throw err
        }else{
            //res.send(user);
            console.log(user);
            res.render('userdetail', { user: user })
        }
    })
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/');
    }
}

module.exports = router;
