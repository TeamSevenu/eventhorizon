var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'landing.html'));
});

router.get('/HomePage', ensureAuth, function(req, res, next)
{
    res.render('HomePage',{title:'HomePage'});
});

router.get('/custHome', ensureAuth, function(req, res, next)
{
    res.render('custHome',{title:'custHome'});
});

router.get('/supHome', ensureAuth, function(req, res, next)
{
    res.render('supHome',{title:'supHome'});
});
router.get('/servHome', ensureAuth, function(req, res, next)
{
    res.render('servHome',{title:'servHome'});
});



function ensureAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');

}
module.exports = router;
