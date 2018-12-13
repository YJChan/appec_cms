let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const config = require('./config/config.json');
//const cors = require('cors');
let resp = require('./utils/resp');

//web router
let indexRouter = require('./routes/index');
let adminRouter = require('./routes/web/admin');
let postRouter = require('./routes/web/post');
//let mainRouter = require('./routes/web/main');
//let usersRouter = require('./routes//web/users');

//api router
let adminApi = require('./routes/api/admin');
let roleApi = require('./routes/api/role');
let rightApi = require('./routes/api/right');
let postApi = require('./routes/api/post');
let categoryApi = require('./routes/api/category');
let tagApi = require('./routes/api/tag');
let imageApi = require('./routes/api/image');
let userApi = require('./routes/api/user');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit:'5mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//serve files
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/')));
app.use('/riot', express.static(path.join(__dirname, '/views/app/riot/')));

//use cors
//app.use(cors())

app.use('/', indexRouter);
app.use('/' + config.development.adminpanel, adminRouter);
app.use('/post', postRouter);
//app.use('/', mainRouter);
//app.use('/users', usersRouter);
app.use('/admin', adminApi);
app.use('/role', roleApi);
app.use('/right', rightApi);
app.use('/api/post', postApi);
app.use('/api/category', categoryApi);
app.use('/api/tag', tagApi);
app.use('/api/image', imageApi);
app.use('/api/user', userApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {			
	next(createError(404, 'We couldn\'t find this page.'));
});

// error handler
app.use(function(err, req, res, next) {
	let response = new resp();	
	
	// set locals, only providing error in development
	if(err.api !== null && err.api !== undefined){		
		//res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.locals.message = err.message;    
		res.locals.error = config.environment === 'development' ? err: {};
    
		response.initResp(null, {
			msg: err.message,
			code: err.code !== undefined? err.code: err.status,
			reason: err.stack
		});
		res.status(err.status).send(response);
	}else{
		//render the error page		
		res.status(err.status || 500);
		res.render('error', {
			title: 'Ops, Something wrong.',
			message: err.message,
			status: err.status,
			stack: config.environment === 'development' ? err.stack: {}
		});
	}  
});

module.exports = app;
