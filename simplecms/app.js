var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config/config.json');
//const cors = require('cors')
var resp = require('./utils/resp');

//web router
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/web/admin');
//var usersRouter = require('./routes//web/users');

//api router
var adminApi = require('./routes/api/admin');
var roleApi = require('./routes/api/role');
var rightApi = require('./routes/api/right');
var postApi = require('./routes/api/post_es5');
var categoryApi = require('./routes/api/category');
var tagApi = require('./routes/api/tag');
var imageApi = require('./routes/api/image');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//serve files
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/')));
app.use('/riot', express.static(path.join(__dirname, '/views/app/riot/')));

//use cors
//app.use(cors())

app.use('/', indexRouter);
app.use('/' + config.development.adminpanel, adminRouter);
//app.use('/users', usersRouter);
app.use('/admin', adminApi);
app.use('/role', roleApi);
app.use('/right', rightApi);
app.use('/api/post', postApi);
app.use('/api/category', categoryApi);
app.use('/api/tag', tagApi);
app.use('/api/image', imageApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	let response = new resp();
  
	// set locals, only providing error in development
	if(err.api !== null){
		//res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.locals.message = err.message;    
		res.locals.error = config.environment === 'development' ? err: {};
    
		response.initResp(null, {
			msg: err.message,
			code: err.code !== undefined? err.code: 401,
			reason: err.stack
		});
		res.status(401).send(response);
	}else{
		//render the error page
		res.status(err.status || 500);
		res.render('error');
	}  
});

module.exports = app;
