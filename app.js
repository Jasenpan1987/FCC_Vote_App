var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var configDb = require('./configs/db.config.js');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var poll = require('./routes/poll');

var app = express();

mongoose.connect(configDb.url);

require('./configs/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: "cookiecat",
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60*60*24
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', routes);
app.use('/user', users);
app.use('/auth', auth);
app.use('/poll', poll);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
