
"use strict";

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

class Search {
    constructor()
    {

    }

    sarchEvents(keyname)
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var query = {name: keyname };
            dbo.collection("eventbases").find(query).toArray(function(err, result) {
                if (err) throw err;
                db.close();
            });
        });
    }

    searchDate(date)
    {
        //find date
    }

    searchService(keyword)
    {
        //find service
    }

    allEvents(username)
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var query = {organizer: username};
            dbo.collection("eventbases").find(query).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                console.log(result);
            });
        });
    }

    showEvents()
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            dbo.collection("eventbases").find().toArray(function(err, result) {
                if (err) throw err;
                db.close();
                console.log(result);
            });
        });
    }
    allItems()
    {
        //Have a view that shows all items
    }

    allServices()
    {
        //Have a view that shows all services
    }




}

module.exports = Search;
