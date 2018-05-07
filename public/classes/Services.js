"use strict";

//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var eventbase = require('../../Model/eventbase.js');
var servicebase = require('../../Model/servicebase.js');


//SERVICES CLASS ENCAPSULATES THE INFORMATION RELATED TO THE SUPPLIER NAME, SERVICE TYPE AND PRICING
//THE METHODS PROVIDED ARE INHERITED BY THE SUBCLASSES SO IT APPLIES TO THEIR CASE AS WELL
class Services{
    constructor(sup_id, type, price)
    {
        this.sup_id = sup_id;
        this.type = type;
        this.price = price;

    }


    specify()
    {
        //GETS OVERRIDDEN IN THE CHILDREN CLASSES OF ENTERTAINER, CATERER AND STAFF
    }

    //THIS METHOD ALLOWS THE USER TO VIEW AL SERVICES THAT IS OFFERED BY THE CURRENTLY LOGGED IN USER
    allServices(user, callback)
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var query = {organizer: user};
            dbo.collection("servicebases").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                db.close();
               return callback(result);
            });
        });
    }

    //THIS METHOD ALLOWS THE DELETION OF A SERVICE FROM THE INVENTORY BASED ON A KEYWORD(TITLE OF SERVICE) THAT IS PASSED IN THE PARAMETER
    deleteServices(title, user)
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var myquery = { title:title, organizer:user};
            dbo.collection("servicebases").deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                db.close();
            });
        });

    }
    //THIS METHOD RETURNS ALL THE SERVICES AVAILABLE ON THE DATABASE BELONGING TO ANY USER
    collection(callback){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            dbo.collection("servicebases").find().toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                return callback(result);
                db.close();
            });
        });
    }



}

module.exports = Services;
