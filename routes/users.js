var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

//Database
var userdatabase = require('../Model/userdatabase.js');
var eventbase = require('../Model/eventbase.js');
var servicebase = require('../Model/servicebase.js');
var itembas = require('../Model/itembas.js');
var ticketbase = require('../Model/ticketbase.js');

//CLASSES//
//1) User Class
var user = require('../public/classes/User.js');
//2) Login Class
var login = require('../public/classes/Login.js');
//3) Event Class
var event = require('../public/classes/Events.js');
//4 Search Class
var search = require('../public/classes/Search.js');
searchObject = new search();
//5 Item Class
var item = require('../public/classes/Item.js');
//6 Caterer
var caterer = require('../public/classes/Caterer.js');
//7 Staff
var staff = require('../public/classes/Staff.js');
//8 Entertainer
var entertainer = require('../public/classes/Staff.js');

//********************************************************************

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('EVENT HORIZON');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});


router.get('/login', function(req, res, next) {
    res.render('login', {title:'Login'});
});
router.post('/register', urlencodedParser, upload.single('profile'),function(req, res, next) {

    //VALIDATING FORM DATA
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email','Email field is required').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords no match').equals(req.body.password);

    //ERROR CHECKING
    var errors = req.validationErrors();
    if(errors)
    {
        res.render('register',{errors:errors});
    }
    else {
        //When data is valid
        var user1 = new user(req.body.name, req.body.username, req.body.password, req.body.email, "1212", "121", req.body.type);
        //user1.details(); //TESTING

        //Creating Database Entry
        var newUser = new userdatabase({

            email:user1.getEmail(),
            username: user1.getUsername(),
            password:user1.getPass(),
            phone:user1.getPhone(),
            type:user1.getType()
        });

        userdatabase.createUser(newUser, function(error, user){
            if(error)throw error;
            console.log(user);
        });

        //MESSAGES FOR USER NOTIFY
        req.flash('success', 'SUCCESS!!! You are registered!');
        //REDIRECTION TO A DIFFERENT ROUTE
        res.location('/HomePage');
        res.redirect('/HomePage');
    }

});


router.post('/login', urlencodedParser, passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username/pass'}),
    function(req, res) {
    var login1 = new login();
    login1.loginAttempt(req.body.username, req.body.password);
    //login1.loginDetails(); //FOR TESTING

    req.flash('success', 'You are now logged in!' + "  " +login1.getUsername());
    res.redirect('/HomePage');
});

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
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    userdatabase.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.get('/logout', function(req, res)
{
    req.logout();
    req.flash('success','You are now logged out');
    res.redirect('/users/login');
});


//////EVENT CREATION/////////////////////
router.post('/create', urlencodedParser, upload.single('profile'),function(req, res, next) {


    //VALIDATING FORM DATA
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('venue','Venue field is required').notEmpty();

    //ERROR CHECKING
    var errors = req.validationErrors();
    if(errors)
    {
        res.render('HomePage',{errors:errors});
    }
    else {
        //When data is valid
        var event1 = new event(req.body.name, req.body.venue, req.body.date, req.body.status, req.user.username);
        //user1.details(); //TESTING

        //Creating Database Entry
        var newEvent = new eventbase({

            name:event1.getTitle(),
            venue: event1.getVenue(),
            date:event1.getDate(),
            status:event1.getStatus(),
            seats: req.body.ticket,
            organizer: event1.getOrg(),
            price: req.body.price
    });

        eventbase.createEvent(newEvent, function(error, user){
            if(error)throw error;
            console.log(user);
        });

        //MESSAGES FOR USER NOTIFY
        req.flash('success', 'SUCCESS!!! EVENT ' + event1.getTitle() +' CREATED!');
        //REDIRECTION TO A DIFFERENT ROUTE
        res.location('/HomePage');
        res.redirect('/HomePage');
    }

});

//SEARCHING MONGODB
var searchResult = null;
router.post('/search', urlencodedParser, function(req, res)
{
    searchResult=req.body.keyword;
    req.flash('success', 'View now please');
    res.location('/custHome');
    res.redirect('/custHome');
});

router.get('/searchResult', function(req, res)
{

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var query = {name: searchResult};
        dbo.collection("eventbases").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
            db.close();
        });
    });

});

router.get('/history', function(req, res)
{
    //searchObject.allEvents(req.user.username);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var query = {organizer: req.user.username };
        dbo.collection("eventbases").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
            db.close();
        });
    });

});

router.get('/allEvents', function(req, res)
{
    //searchObject.showEvents();
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        dbo.collection("eventbases").find().toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result));
            db.close();
        });
    });
});


router.post('/addItem', urlencodedParser ,function(req, res, next) {


    //ERROR CHECKING
    var errors = req.validationErrors();
    if(errors)
    {
        res.render('supHome',{errors:errors});
    }
    else {
        //When data is valid
        var item1 = new item(req.user.username, req.body.type, req.body.price, req.body.description, req.body.stockno);

        item1.addItem();
        //MESSAGES FOR USER NOTIFY
        req.flash('success', 'SUCCESS!!! ITEM ADDED TO INVENTORY!');
        //REDIRECTION TO A DIFFERENT ROUTE
        res.location('/supHome');
        res.redirect('/supHome');
    }

});

router.post('/deleteItem', urlencodedParser, function(req, res)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var myquery = { Type:req.body.type, Owner:req.user.username};
        dbo.collection("itembas").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            req.flash('success', 'SUCCESS!!! ITEM DELETED!');
            db.close();
        });
    });

    res.location('/supHome');
    res.redirect('/supHome');
});

router.get('/allItems', function(req, res)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var query = {Owner: req.user.username };
        dbo.collection("itembas").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
            db.close();
        });
    });
});

router.post('/addService', urlencodedParser ,function(req, res, next) {


    //ERROR CHECKING
    var errors = req.validationErrors();
    if(errors)
    {
        res.render('servHome',{errors:errors});
    }
    else {
        //When data is valid
        if(req.body.status == 'Entertainer')
        {
            var newEvent = new servicebase({

                title:req.body.title,
                type:req.body.status,
                price:req.body.price,
                artist:req.body.artname,
                genre:req.body.genre,
                cusine:null,
                head:null,
                special:null,
                hours:null,
                organizer:req.user.username
            });

            servicebase.createService(newEvent, function(error, user){
                if(error)throw error;
                console.log(user);
            });
        }
        else if(req.body.status == 'Cater') {
            var newEvent = new servicebase({

                title:req.body.title,
                type:req.body.status,
                price:req.body.price,
                artist:null,
                genre:null,
                cusine:req.body.cusine,
                head: req.body.head,
                special:null,
                hours:null,
                organizer:req.user.username
            });
            servicebase.createService(newEvent, function (error, user) {
                if (error) throw error;
                console.log(user);
            });
        }
        else if(req.body.status == 'Staff')
        {
            var newEvent = new servicebase({

                title:req.body.title,
                type:req.body.status,
                price:req.body.price,
                artist:null,
                genre:null,
                cusine:null,
                head: null,
                special:req.body.special,
                hours:req.body.hours,
                organizer:req.user.username
            });
            servicebase.createService(newEvent, function(error, user){
                if(error)throw error;
                console.log(user);
            });


        }

        //MESSAGES FOR USER NOTIFY
        req.flash('success', 'SUCCESS!!! SERVICE ADDED TO INVENTORY!');

        res.location('/servHome');
        res.redirect('/servHome');
    }

});

router.post('/deleteService', urlencodedParser, function(req, res)
{

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var myquery = { title:req.body.type, organizer:req.user.username};
        dbo.collection("servicebases").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            req.flash('success', 'SUCCESS!!! SERVICE DELETED!');
            db.close();
        });
    });

    res.location('/servHome');
    res.redirect('/servHome');
});

router.get('/allServices', function(req, res)
{
    //searchObject.showEvents();
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var query = {organizer: req.user.username };
        dbo.collection("servicebases").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
            db.close();
        });
    });
});


router.post('/buyTicket', urlencodedParser, function(req, res)
{

    var errors = req.validationErrors();
    if(errors)
    {
        res.render('HomePage',{errors:errors});
    }
    else {

        //Creating Database Entry
        var newEvent = new ticketbase({

            name: req.body.name,
            number: req.body.number,
            price:req.body.price,
            customer: req.user.username

        });

        ticketbase.createTicket(newEvent, function(error, user){
            if(error)throw error;
            console.log(user);
        });

        //REDIRECTION TO A DIFFERENT ROUTE
        res.location('/custHome');
        res.redirect('/custHome');
    }


});

router.get('/showTickets', function(req, res)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        var query = {customer: req.user.username};
        dbo.collection("ticketbases").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
            db.close();
        });
    });
});

router.get('/serviceCollection', function(req, res)
{
    //searchObject.showEvents();
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nodeauth");
        dbo.collection("servicebases").find().toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.stringify(result));
            db.close();
        });
    });
});

module.exports = router;
