
"use strict";

//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var eventbase = require('../../Model/eventbase.js');


//EVENT CLASS ENCAPSULATES ALL INFORMATION RELATED TO AN EVENT AND PROVIDES METHODS TO CREATE, VIEW ALL AND SEARCH FOR A
//PARTICULAR EVENT. THIS MAKES EVENT MANAGEMENT CONVENIENT FOR THE USERS WHO ARE ORGANIZING
class Events{
    constructor(title, venue, date, status, seats, price, service, items, org)
    {
        this.title = title;
        this.venue= venue;
        this.date = date;
        this.status= status;
        this.seats = seats;
        this.price = price;
        this.service = service;
        this.item = items;
        this.org = org;
    }

    //RETURNS TITLE OF THE EVENT FOR DISPLAY PURPOSES
    getTitle(){
        return(this.title);
    }


    //CREATES AN EVENT IN THE DATABASE USING MONGOOSE-MONGODB HANDLER SPECIFIC TO EACH USER WHO INVOKES THIS METHOD
  createEvent(){

      var newEvent = new eventbase({

          name:this.title,
          venue: this.venue,
          date:this.date,
          status:this.status,
          seats: this.seats,
          price: this.price,
          service:this.service,
          item: this.item,
          organizer: this.org

      });

      eventbase.createEvent(newEvent, function(error, user){
          if(error)throw error;
          console.log(user);
      });

  }

  //RETURNS ALL EVENTS AVAILABLE IN THE DATABASE MADE BY ALL USERS ON THE SYSTEM
  allEvents(callback)
  {
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("nodeauth");
          dbo.collection("eventbases").find().toArray(function(err, result) {
              if (err) throw err;
              db.close();
              return callback(result);
          });
      });
  }

  //RETURNS EVENTS BASED ON A SPECIFIC QUERY CHOSEN BY USER WHO INVOKES THIS METHOD
  searchEvent(searchResult, callback)
  {
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("nodeauth");
          var query = {name: searchResult};
          dbo.collection("eventbases").find(query).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
              db.close();
              return callback(result);
          });
      });
  }


}

module.exports = Events;
