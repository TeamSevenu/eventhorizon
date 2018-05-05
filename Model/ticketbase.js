var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var TicketSchema = mongoose.Schema({

    name: {
        type: String
    },
    number:{
        type:Number

    },
    price: {
        type: String
    },
    customer:{
        type: String

    }
});

var ticketbase = module.exports = mongoose.model('ticketbase', TicketSchema);


//DATABASE ENTRY AND PASSWORD ENCRYPTION
module.exports.createTicket = function(newUser, callback)
{
    newUser.save(callback);

};
