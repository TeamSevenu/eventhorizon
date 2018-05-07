"use strict";

//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var service = require('./Services');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var servicebase = require('../../Model/servicebase.js');

//ENTERTAINER CLASS IS A SUBCLASS OF THE SERVICE CLASS WHICH INHERITS ITS FIELDS AND METHODS
class Entertainer extends service{
    constructor(sup_id, type, price, artist_name, genre)
    {
        super(sup_id, type, price); //PARENT CONSTRUCTOR
        this.artist_name = artist_name;
        this.genre = genre;
    }

    //OVERRIDES THE PARENT METHOD
    //CREATES A DATABASE ENTRY FOR EVERY CATERING SERVICE CREATED USING MOONGOOSE-MONGODB DATABASE HANDLER
    specify(user){

        var newEvent = new servicebase({
            title:this.sup_id,
            type:this.type,
            price:this.price,
            artist:this.artist_name,
            genre:this.genre,
            cusine:null,
            head:null,
            special:null,
            hours:null,
            organizer:user
        });

        servicebase.createService(newEvent, function(error, user){
            if(error)throw error;
            console.log(user);
        });
    }

}

module.exports = Entertainer;
