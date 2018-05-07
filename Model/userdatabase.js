var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;
// USER SCHEMA FOR THE VALUES TO BE INPUT FROM THE SERVER
var UserSchema = mongoose.Schema({

    name:{
        type:String,
    },
    email:{
        type: String
    },
    username:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },

});

var userdatabase = module.exports = mongoose.model('userdatabase', UserSchema);

//ID FINDING
module.exports.getUserById = function(id, callback){
    userdatabase.findById(id, callback);
};

//NAME FINDING
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    userdatabase.findOne(query, callback);
};

//PASSWORD
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
};

//DATABASE ENTRY AND PASSWORD ENCRYPTION
module.exports.createUser = function(newUser, callback)
{   bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password,salt, function(err,hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });

};
