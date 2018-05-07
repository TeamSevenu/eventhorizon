//MIDDLEWARE AND LIBRARIES USED TO SET UP, DEPLOY AND EXTEND FUNCTIONALITY OF THE WEB APPLICATION
var createError = require('http-errors'); //FOR ERRORS
var express = require('express'); //EXPRESS FRAMEWORK WHICH SUPPORTS SERVER
var path = require('path'); //DIRECTORY ACCESS
var cookieParser = require('cookie-parser'); //FOR BROWSER COOKIES
var logger = require('morgan'); //CONSOLE LOGGING
var session = require('express-session'); //SESSION MANAGEMENT
var passport =require('passport'); //PASSPORT AUTHENTICATION SERVER
var LocalStrategy = require('passport-local').Strategy; //LOGIN AUTHENTICATION SERVER
var bodyParser = require('body-parser'); //FOR PARSING POST REQUESTS
var bcrypt = require('bcryptjs'); //FOR PASSWORD ENCRYPTION
var expressValidator = require('express-validator'); //FOR VALIDATING FORMS
var multer = require('multer'); //FOR IMAGE UPLOADS
var upload = multer({dest: './uploads'}); //FOR IMAGE UPLOADS
var flash = require('connect-flash'); //FOR FLASH MESSAGING TO ALERT USER FOR ERRORS

//DATABASE HANDLERS AND INTERFACES FOR MONGO-DB
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

//ROUTES AVAILABLE FOR THE USER
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//CREATE AN EXPRESS APPLICATION
var app = express();

//CONFIGURE VIEWS FOR THE FRONT END USING JADE ENGINE/HTML
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//SET UP THE LIBRARIES FOR USAGE

//FOR SESSION MANAGEMENT
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//FOR ERROR DETECTION AND USER NOTIFICATION
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//FOR USER IDENTIFICATION AND ACCESSIBILITY
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
     next();
});

//ROUTE USER REQUEESTS TO THE AVAILABLE PATHS
app.use('/', indexRouter);
app.use('/users', usersRouter);

//CATCH 404 ERROR AND LOG IT
app.use(function(req, res, next) {
  next(createError(404));
});

//GENERAL ERROR HANDLER
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
