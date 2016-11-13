var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models').User;
var Poll = require('../models').Poll;

router.get('/newpoll', function(req, res){
    res.render('newpoll', {user: req.user})
});

router.post('/newpoll', function(req, res){
    var title = req.body.pollTitle;
    var votes = [];
    var optionArr = (req.body.pollOptions.split('\n')).map(function(poll){
        votes.push(0);
        return poll.replace(/\r/g, "");
    });

    var newPoll = new Poll();
    newPoll.title = title;
    newPoll.options = optionArr;
    newPoll.votes = votes;

    var currentUser = req.user;

    newPoll.save(function(err, poll){
        if(err){
            throw err;
        }else{
            currentUser.polls.push(poll._id);
            currentUser.save(function(err, user){
                if(err){
                    throw err;
                }else{
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/polldetail/:id', function(req, res){
    //res.send(req.params.id)
    var currentUser = req.user;
    var id = req.params.id;
    Poll.findOne({_id: id}, function(err, poll){
        if(err){
            throw err;
        }else{
            res.render('polldetail', {
                poll: poll,
                user: currentUser
            })
        }
    })
});

router.post('/polldetail/:pollId', function(req, res){
    //req.params.id
    //req.body = {"optionsRadios": "2"}
    //process for key is a variable
    //should be $inc: { votes.idx: 1 }
    var idx = 'votes.'+req.body.optionsRadios;
    var query = {};
    query[idx] = 1;
    query['totalVotes'] = 1;


    Poll.update({_id: req.params.pollId}, {
        $inc: query
    }).exec(function(err, result){
        if(err){
            res.send(err)
        }else{
            var targetUrl = '/poll/polldetail/'+req.params.pollId;
            res.redirect(targetUrl);
        }
    });
});

router.get('/polldelete/:poll_id', ensureAuthenticated, function(req, res){
    var pollId = req.params.poll_id;
    User.findOne({polls: { "$in" : [pollId]} }, function(err, user){
        if(req.user._id+''==''+user._id){
            Poll.remove({_id: pollId}, function(err){
                if(err){
                    throw err;
                }else{
                    user.polls = user.polls.filter(function(poll){
                        return poll != pollId;
                    });

                    user.save(function(err){
                        if(err){
                            throw err;
                        }else{
                            res.redirect('/user');
                        }
                    })
                }
            })
        }
    });

});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/user');
    }
}
module.exports = router;