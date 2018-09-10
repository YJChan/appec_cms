var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config/config.json');
var resp = require('./utils/resp');

//web router
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes//web/users');


//api router
var adminApi = require('./routes/api/admin');
var roleApi = require('./routes/api/role');
var rightApi = require('./routes/api/right');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/admin', adminApi);
app.use('/role', roleApi);
app.use('/right', rightApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = config.environment === 'development' ? err: {};
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  var response = new resp();
  response.initResp(null, {
    msg: err.message,
    code: 401,
    reason: err.stack
  });
  res.status(401).send(response);
});

module.exports = app;
