var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var authConfig = require('./auth');
var User = require('../models/index').User;

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: authConfig.googleAuth.clientID,
            clientSecret: authConfig.googleAuth.clientSecret,
            callbackURL: authConfig.googleAuth.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            User.findOne({'google.id': profile.id}, function(err, user){
                if(err){
                    done(err);
                }else{
                    if(user){//found user in the database
                        console.log(user)
                        done(null, user);
                    }else{//user is not in the database, need to save user and authorize
                        var newUser = new User();
                        newUser.google.id    = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function(err){
                            if(err){
                                return done(err);
                            }else{
                                return done(null, newUser);
                            }
                        })
                    }
                }
            });

        }
    ));
};
