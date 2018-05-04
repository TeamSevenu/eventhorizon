var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var ItemSchema = mongoose.Schema({

    Owner:{
        type:String,
        index:true
    },
    Price:{
        type: Number
    },
    Type:{
        type: String
    },
    Description:{
        type:String
    },
    Stock: {
        type: Number
    }
});

var itembas = module.exports = mongoose.model('itembas', ItemSchema);


//DATABASE ENTRY
module.exports.addItem = function(newUser, callback)
{
    newUser.save(callback);

};
