//MIDDLEWARE AND LIBRARIES
var express = require('express');//EXPRESS FRAMEWORK
var router = express.Router(); //EXPRESS ROUTING
var path = require('path'); //DIRECTORY ACCESS FOR RESOUCES

//1) THIS ROUTE DISPLAYS THE LANDING PAGE FOR THE EVENT HORIZON WEB APPLICATION
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'landing.html'));
});
////////////////////////////////////////////////////////////////////////////

//2) THIS ROUTE DISPLAYS THE HOMEPAGE ONCE AN USER SIGNS IN SUCCESSFULLY
router.get('/users',ensureAuth, function(req, res, next) {
    res.render('greeting', {title:'greeting'});
});
//////////////////////////////////////////////////////////////////////////////

//3) THIS ROUTE DISPLAYS THE ORGANIZER PAGE WHERE USER CAN CREATE AND VIEW PAST EVENTS
router.get('/HomePage', ensureAuth, function(req, res, next)
{
    res.render('HomePage',{title:'HomePage'});
});
////////////////////////////////////////////////////////////////////////////////////////////

//4) THIS ROUTE DISPLAYS THE CUSTOMER PAGE WHERE USER CAN BUY TICKETS FOR EVENTS AND VIEW TRANSACTIONS
router.get('/custHome', ensureAuth, function(req, res, next)
{
    res.render('custHome',{title:'custHome'});
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//5) THIS ROUTE DISPLAYS THE SUPPLIER PAGE WHERE USER CAN CREATE/DELETE ITEM INVENTORY AND VIEW THEIR INVENTORY
router.get('/supHome', ensureAuth, function(req, res, next)
{
    res.render('supHome',{title:'supHome'});
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//6) THIS ROUTE DISPLAYS THE SUPPLIER PAGE WHERE USER CAN CREATE/DELETE SERVICES INVENTORY AND VIEW THEIR INVENTORY
router.get('/servHome', ensureAuth, function(req, res, next)
{
    res.render('servHome',{title:'servHome'});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS FUNCTION IS RESPONSIBLE FOR ACCESSIBILITY AND ALLOWS
//ONLY VERIFIED LOGGED IN USERS TO ACCESS THE FUNCTIONALITIES OF THE WEBSITE
function ensureAuth(req, res, next){
    if(req.isAuthenticated()){
        //IF USER IS LOGGED IN ALLOW ACCESS
        return next();
    }
    //IF NOT PROMPT USER TO LOG IN
    res.redirect('/users/login');

}
module.exports = router;
