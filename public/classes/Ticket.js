
"use strict";
//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var event = require('./Events');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var ticketbase = require('../../Model/ticketbase.js');

//TICKET CLASS ENCAPSUALATES INFORMATION RELATED TO THE TICKET PURCHASES AND DETAILS OF THE EVENT THAT TICKET BELONGS TO
class Ticket {
    constructor(name, number, price, customer)
    {
       this.name = name;
       this.number = number;
       this.price = price;
       this.customer = customer;

    }

    //ADDS A TICKET TO THE DATABASE WITH THE TICKET HOLDER NAME, EVENT NAME AND PRICING
    addTicket()
    {
        var newEvent = new ticketbase({

            name: this.name,
            number: this.number,
            price:this.price,
            customer: this.customer
        });
        ticketbase.createTicket(newEvent, function(error, user){
            if(error)throw error;
            console.log(user);
        });

    }

    //SHOWS ALL THE TICKETS PURCHASED BY THE USER WHO IS CURRENTLY LOGGED IN
    show(user, callback){

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var query = {customer: user};
            dbo.collection("ticketbases").find(query).toArray(function(err, result) {
                if (err) throw err;
                callback(result);
                db.close();
            });
        });
    }
}

module.exports = Ticket;
