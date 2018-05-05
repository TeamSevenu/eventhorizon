var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var EventSchema = mongoose.Schema({

    name:{
        type:String,
        index:true
    },
    venue:{
        type: String
    },
    date:{
        type: Date
    },
    password:{
        type:String
    },
    status: {
        type: String
    },
    seats:{
        type:Number
    },
    price:{
        type:Number
    },
    organizer:{
        type: String
    }
});

var eventbase = module.exports = mongoose.model('eventbase', EventSchema);


//DATABASE ENTRY AND PASSWORD ENCRYPTION
module.exports.createEvent = function(newUser, callback)
{
        newUser.save(callback);

};
