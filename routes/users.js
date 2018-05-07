

//LIBRARIES MIDDLEWARE NEEDED FOR EXTENDING THE BASE FUNCTIONALITIES OF THE PROGRAM
var express = require('express'); //express framework for server deployment
var router = express.Router(); //to enable routing based on get/post
var multer = require('multer'); //for uploading images
var upload = multer({dest: './uploads'}); //for uploading images
var bodyParser = require('body-parser'); //for parsing post requests
var urlencodedParser = bodyParser.urlencoded({extended:false});
var passport =require('passport'); //for securing login and authentication with database
var LocalStrategy = require('passport-local').Strategy; //local authentication server
//********************************************************************

//DATABASE HANDLERS AND INTERFACES: MONGODB IS USED
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var userdatabase = require('../Model/userdatabase.js');
//********************************************************************


//CLASS DECLARATIONS, IMPLEMENTATIONS IS IN SEPARATE FILES FOR ENCAPSULATIONS//
//1) User Class
var user = require('../public/classes/User.js');
//2) Login Class (for testing)
var login = require('../public/classes/Login.js');
//3) Event Class
var event = require('../public/classes/Events.js');
//5 Item Class
var item = require('../public/classes/Item.js');
//6 Caterer Class
var caterer = require('../public/classes/Caterer.js');
//7 Staff Class
var staff = require('../public/classes/Staff.js');
//8 Entertainer Class
var entertainer = require('../public/classes/Entertainer.js');
//9 Services Class
var service = require('../public/classes/Services.js');
//10 Ticket Class
var ticket = require('../public/classes/Ticket.js');
//********************************************************************

//ROUTES AVAILABLE//

//1) THIS PATH DISPLAYS THE REGISTRATION PAGE TO THE USER
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});
////////////////////////////////////////////////////////////

//2) THIS PATH DISPLAYS THE LOGIN PAGE TO THE USER
router.get('/login', function(req, res, next) {
    res.render('login', {title:'Login'});
});
////////////////////////////////////////////////////////////


//3 THIS PATH RECEIVES THE REGISTRATION FORM INFORMATION FROM THE USER AND PROCESSES IT
router.post('/register', urlencodedParser, upload.single('profile'),function(req, res, next) {

    //VALIDATING FORM DATA ENTERED AND COMPILES LIST OF ERRORS
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email','Email field is required').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords no match').equals(req.body.password);

    //ERRORS OBTAINED FROM VALIDATION PROCESS, SUCH AS INCORRECT FIELDS AND FORMATS
    var errors = req.validationErrors();

    if(errors)
    {
        //IF ERRONEOUS DATA FOUND, NOTIFY USER AND PROMPT TO ENTER DATA AGAIN
        res.render('register',{errors:errors});
    }
    else {

        //IF DATA IS VALID, CREATE AN INSTANCE OF USER CLASS AND PASS IN USER ENTERED INFORMATION
        var user1 = new user(req.body.name, req.body.email,req.body.username, req.body.password, req.body.phone);

        //INVOKES CREATE USER METHOD IN USER CLASS WHICH WILL STORE THE DATA IN THE DATABASE
        user1.createUser();

        //MESSAGES FOR USER NOTIFICATION
        req.flash('success', 'SUCCESS!!! You are registered!');

        //REDIRECTION TO A DIFFERENT ROUTE AFTER THIS PATH IS DONE PROCESSING
        res.location('/users');
        res.redirect('/users');
    }

});
///////////////////////////////////////////////////////////////////////////////

//4 THIS PATH RECEIVES LOGIN CREDENTIALS AND VERIFIES WITH THE LOCAL AUTHENTICATION SERVER
router.post('/login', urlencodedParser, passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username/pass'}),
    function(req, res) {

    //CREATES LOGIN CLASS TO HOLD USERNAME AND PASSWORD FOR THE AUTHENTICATION PROCESS
    var login1 = new login();
    login1.loginAttempt(req.body.username, req.body.password);

    //ALERTS THE USER THE STATUS OF THEIR LOGIN
    req.flash('success', 'You are now logged in!' + "  " +login1.getUsername());

    //REDIRECTS THE USER TO THE HOMEPAGE OF EVENT HORIZON
    res.redirect('/users');
});

//5 AUTHENTICATION SERVER PROCESS, METHODS AND HANDLING PROVIDED BY THE PASSPORT MIDDLEWARE LIBRARY INSTALLED
//COMPARES USERNAME AND PASSWORD TO EXISTING DATABASE VALUES, AND CONFIRMS LOGIN
passport.use(new LocalStrategy(function(username, password, done){
    userdatabase.getUserByUsername(username, function(err, userman){
        if(err) throw err;
        if(!userman){
            return done(null, false, {message: 'Unknown User'});
        }

        userdatabase.comparePassword(password, userman.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null, userman);
            } else {
                return done(null, false, {message:'Invalid Password'});
            }
        });
    });
}));
//ASSIGNS EVERY USER A DIFFERENT SESSION SO THE INDIVIDUAL USER INFORMATION IS SAFE FROM OTHER
//EACH SESSION IS MANAGED BY THE PASSPORT MIDDLEWARE
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    userdatabase.getUserById(id, function(err, user) {
        done(err, user);
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////

//6) THE USER IS ABLE TO LOG OUT AND TERMINATE THEIR SESSION USING THIS ROUTE
router.get('/logout', function(req, res)
{
    //USER LOGS OUT
    req.logout();
    //NOTIFIES THE USER IF THEY ARE SUCCESSFULLY LOGGED OUT
    req.flash('success','You are now logged out');
    //REDIRECTED TO LOGIN PAGE
    res.redirect('/users/login');
});
////////////////////////////////////////////////////////////////////////////////////////

//7) THIS PATH ALLOWS THE USER TO POST THEIR DATA REGARDING EVENT AND TRIES TO CREATE AN EVENT IN THE DATABASE
router.post('/create', urlencodedParser, upload.single('profile'),function(req, res, next) {

    //VALIDATING FORM DATA ENTERED AND COMPILES LIST OF ERRORS
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('venue','Venue field is required').notEmpty();

    //ERRORS OBTAINED FROM VALIDATION PROCESS, SUCH AS INCORRECT FIELDS AND FORMATS
    var errors = req.validationErrors();
    if(errors)
    {
        //RENDERS HOMEPAGE IF ERROR IS FOUND
        res.render('HomePage',{errors:errors});
    }
    else {
        //IF DATA IS VALID CREATES EVENT CLASS INSTANCE AND INSTANTIATES WITH THE USER ENTER PARAMETERS
        var event1 = new event(req.body.name, req.body.venue, req.body.date, req.body.status, req.body.seats, req.body.price, req.body.service, req.body.item, req.user.username);

        //INVOKES THE CREATE EVENT TO ADD TO DATABASE
        event1.createEvent();

        //MESSAGES FOR USER NOTIFICATION
        req.flash('success', 'SUCCESS!!! EVENT ' + event1.getTitle() +' CREATED!');

        //REDIRECTION TO A DIFFERENT ROUTE
        res.location('/HomePage');
        res.redirect('/HomePage');
    }

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//8) THE SUBSEQUENT POST AND GET ROUTE RECEIVES A KEYWORD FROM THE USER AND USES IT TO SEARCH FOR AN EVENT WITH THAT QUERY
var searchResult = null;
router.post('/search', urlencodedParser, function(req, res)
{
    //RECEIVES AND STORES THE SEARCH KEYTERM
    searchResult=req.body.keyword;
    //ALERTS THE USER TO TRIGGER THE NEXT ACTIVITY TO GET THE SEARCH RESULT
    req.flash('success', 'View now please');
    res.location('/custHome');
    res.redirect('/custHome');
});
router.get('/searchResult', function(req, res)
{
    //CREATES AND INSTANCE OF THE EVENT CLASS AND USES IT TO SEARCH FOR AN EVENT AND RETURNS THE RESULTS TO USER
    var event1 = new event();
    event1.searchEvent(searchResult, function(result){

        res.send(JSON.stringify(result));
        }

    );

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//9) THIS PATH ALLOWS THE USER TO VIEW ALL THE EVENTS THEY HAVE CREATED/ORGANIZED, ONLY RETURNS EVENTS MADE BY THEM
router.get('/history', function(req, res)
{
    //CREATES AN INSTANCE OF THE USER CLASS AND INVOKES THE PAST EVENTS FUNCTION WHICH USES THE CURRENT USER'S SESSION AS SEARCH KEY
    var past = new user();
    past.pastEvents(req.user.username, function(results){
        res.send(JSON.stringify(results));
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//10) THIS PATH ALLOWS THE USER TO VIEW ALL THE EVENTS AVAILABLE ON THE SYSTEM
router.get('/allEvents', function(req, res)
{
    //CREATES AN INSTANCE OF THE EVENT CLASS AND QUERIES ALL THE EVENTS IN THE DATABASE AND RETURNS THIS TO THE USER
    var all = new event();
    all.allEvents(function(results){
        res.send(JSON.stringify(results));
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//11) THIS PATH ALLOWS A USER TO ADD AN ITEM TO THEIR INVENTORY
router.post('/addItem', urlencodedParser ,function(req, res, next) {

    //ERROR CHECKING OF THE FORMS
    var errors = req.validationErrors();
    if(errors)
    {
        res.render('supHome',{errors:errors});
    }
    else {

        //CREATES AN ITEM CLASS INSTANCE AND PASSES IN THE PARAMETERS ENTERED BY USER
        var item1 = new item(req.user.username, req.body.type, req.body.price, req.body.description, req.body.stockno);

        //INVOKES THE ADD ITEM FUNCTION FROM THE CLASS WHICH ADD AN ITEM TO THE DATABASE
        item1.addItem();

        //FOR USER NOTIFICATION
        req.flash('success', 'SUCCESS!!! ITEM ADDED TO INVENTORY!');

        //REDIRECTS TO ANOTHER PAGE AFTER PATH IS DONE
        res.location('/supHome');
        res.redirect('/supHome');
    }

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//12)THIS PATH ALLOWS AN USER TO DELETE AN ITEM FROM THEIR INVENTORY
router.post('/deleteItem', urlencodedParser, function(req, res)
{
    //CREATES AN INSTANCE OF THE ITEM CLASS AND INVOKES THE DELETE FUNCTION WHICH DELETES AN ITEM BASED ON THE USER POSTED VALUE
    var item1 = new item();
    item1.deleteItem(req.body.type,req.user.username);

    //FOR NOTIFICATION OF STATUS
    req.flash('success', 'SUCCESS!!! ITEM DELETED!');

    //REDIRECTS TO ANOTHER PAGE AFTER PATH IS DONE
    res.location('/supHome');
    res.redirect('/supHome');
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//13) THIS PATH ALLOWS THE USER TO VIEW ALL THE ITEMS IN THE INVENTORY CREATED BY THEM
router.get('/allItems', function(req, res)
{
    //CREATES AN INSTANCE OF THE ITEM CLASS AND INVOKES THE FIND ITEM BASED ON THE CURRENTLY LOGGED IN USER
    //RETURNS THE INVENTORY TO THE USER
    var item1 = new item();
    item1.findItem(req.user.username, function(results){

        res.send(JSON.stringify(results));
    });

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//14) THIS PATH ALLOWS THE USER TO ADD A SERVICE TO THEIR INVENTORY BY ENTERING DETAILS ON THE WEBPAGE
router.post('/addService', urlencodedParser ,function(req, res, next) {

    //ERROR CHECKING AND VALIDATION
    var errors = req.validationErrors();
    if(errors)
    {
        //REPROMPTS THE USER TO ENTER THEIR DATA IF ERRORS ARE FOUND
        res.render('servHome',{errors:errors});
    }
    else {
        //IF THE DATA ENTERED IS VALID, ONE OF THE SUBCLASSES OF SERVICES IS CREATED BASED ON THE SERVICE TYPE
        //CHOSEN BY THE USER ON THE WEBPAGE
        if(req.body.status == 'Entertainer')
        {
            //IF ENTERTAINER, ADD AN ENTERTAINER SERVICE TO USER INVENTORY
            var entertainer1 = new entertainer(req.body.title, req.body.status, req.body.price, req.body.artname, req.body.genre);
            entertainer1.specify(req.user.username);
        }
        else if(req.body.status == 'Cater') {
            //IF CATERER, ADD A CATERER SERVICE TO USER INVENTORY
            var caterer1 = new caterer(req.body.title, req.body.status, req.body.price, req.body.cusine, req.body.headcount);
            caterer1.specify(req.user.username);
        }
        else if(req.body.status == 'Staff')
        {
            //IF STAFF, ADD A STAFF SERVICE TO USER INVENTORY
            var staff1 = new staff(req.body.title, req.body.status, req.body.price, req.body.special, req.body.hours);
            staff1.specify(req.user.username);
        }

        //MESSAGES FOR USER NOTIFICATION
        req.flash('success', 'SUCCESS!!! SERVICE ADDED TO INVENTORY!');

        //REDIRECTS THE USER TO ANOTHER PAGE AFTER THIS PATH IS DONE
        res.location('/servHome');
        res.redirect('/servHome');
    }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//15) THIS PATH ALLOWS AN USER TO DELETE A SERVICE FROM THEIR INVENTORY
router.post('/deleteService', urlencodedParser, function(req, res)
{
    //CREATES AN INSTANCE OF THE SERVICE CLASS AND INVOKES THE DELETE FUNCTION WHICH DELETES A SERVICE BASED ON THE USER POSTED VALUE
    var service1 = new service();
    service1.deleteServices(req.body.title, req.user.username);

    //USER NOTIFICATION
    req.flash('success', 'SUCCESS!!! SERVICE DELETED!');

    //REDIRECTS TO ANOTHER PAGE AFTER THIS PATH IS DONE EXECUTING
    res.location('/servHome');
    res.redirect('/servHome');
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//16) THIS PATH ALLOWS THE USER TO VIEW ALL THE SERVICES IN THE INVENTORY CREATED BY THEM
router.get('/allServices', function(req, res)
{
    //CREATES AN INSTANCE OF THE SERVICE CLASS AND INVOKES THE ALL SERVICE BASED ON THE CURRENTLY LOGGED IN USER
    //RETURNS THE INVENTORY TO THE USER
    var service1 = new service();
    service1.allServices(req.user.username, function(result){

        res.send(JSON.stringify(result));
    });

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//17) THIS PATH ALLOWS THE USER TO BUY TICKETS BASED ON AN EVENT SELECTED BY THEM
router.post('/buyTicket', urlencodedParser, function(req, res)
{

    //ERROR AND VALIDATION CHECKING
    var errors = req.validationErrors();
    if(errors)
    {
        //IF ERRORS FOUND PROMPTS THE USER TO RE-ENTER THE DATA
        res.render('HomePage',{errors:errors});
    }
    else {

        //IF NO ERRORS FOUND, CREATES AN INSTANCE OF THE TICKET CLASS AND INSTANTIATES IT WITH THE PARAMETERS ENTERED BY THE USER
        var ticket1 = new ticket(req.body.name, req.body.number, req.body.price, req.user.username);
        //INVOKES THE ADDTICKET METHOD WHICH ADDS THE TICKET TO THE DATABASE
        ticket1.addTicket();

        //REDIRECTS THE USER AFTER THIS PATH IS DONE EXECUTING
        res.location('/custHome');
        res.redirect('/custHome');

    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//18) THIS PATH ALLOWS THE USER TO SHOW THEIR TICKET PURCHASES IN THE PAST
router.get('/showTickets', function(req, res)
{
    //CREATES A TICKET CLASS AND RETRIEVES THE STORED HISTORY FROM THE DATABASE SPECIFIC TO THE CURRENTLY LOGGED IN USER
   var ticket1 = new ticket();
   ticket1.show(req.user.username,function(result){

       //RETURNS THE TICKET PURCHASES HISTORY
       res.send(JSON.stringify(result));
   });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//19)THIS PATH ALLOWS THE USER TO BUY AN ITEM BASED ON THE CURRENTLY AVAILABLE ITEMS IN THE DATABASE
router.get('/itemCollection', function(req, res){

    //CREATES AN ITEM CLASS AND INVOKES THE VIEW ITEMS WHICH RETURNS ALL THE ITEMS IN THE DATABASE FROM ALL USER INVENTORIES
    var item1 = new item();
    item1.viewItems(function(result){
        res.send(JSON.stringify(result));
        }

    )
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//20)THIS PATH ALLOWS THE USER TO BUY A SERVICE BASED ON THE CURRENTLY AVAILABLE SERVICES IN THE DATABASE
router.get('/serviceCollection', function(req, res)
{
    //CREATES A SERVICE CLASS AND INVOKES THE VIEW SERVICES WHICH RETURNS ALL THE SERVICES IN THE DATABASE FROM ALL USER INVENTORIES
    var service1 = new service();
    service1.collection(function(result){
        res.send(JSON.stringify(result));
    });

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
