var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Added Imports
var cors = require('cors');
var fs = require('fs');
var session = require('express-session');

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vehicleRequestsRouter = require('./routes/vehicleRequests');
var walletRouter = require('./routes/wallet');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(session({
  // Default is good for now
  // genid: function(req) {
  //   return uuidv4(); // use UUIDs for session IDs
  // },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: "/",
    // secure: true, //// TODO: make connection HTTPS and uncomment
    maxAge: 60000
  }
}))

//For logging
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});
app.use(logger('dev', {
  stream: accessLogStream
}));


app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vehicleRequests', vehicleRequestsRouter);
app.use('/wallet', walletRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// TODO: To start the server at the end without using debug mode

// var httpServer = require('http').createServer(app).listen(3001, function() {
//   console.log('Http server started');
// });