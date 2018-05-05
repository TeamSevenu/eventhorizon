var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var ServiceScheme = mongoose.Schema({

    title:{
        type:String,

    },
    type:{
        type:String,
    },
    price:{
        type: Number
    },
    artist:{
        type: String
    },
    genre:{
        type: String
    },
    cusine:{
        type:String
    },
    head:{
        type:Number
    },
    special: {
        type: String
    },
    hours:{
        type: Number
    },
    organizer:{
        type:String,
        index:true
    }
});

var servicebase = module.exports = mongoose.model('servicebase', ServiceScheme);


//DATABASE ENTRY AND PASSWORD ENCRYPTION
module.exports.createService = function(newUser, callback)
{
    newUser.save(callback);

};
