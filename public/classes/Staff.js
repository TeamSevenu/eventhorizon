"use strict";

//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var service = require('./Services');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var servicebase = require('../../Model/servicebase.js');

//STAFF CLASS IS A SUBCLASS OF THE SERVICE CLASS WHICH INHERITS ITS FIELDS AND METHODS
class Staff extends service{
    constructor(sup_id, type, price, speciality, work_hours)
    {
        super(sup_id, type, price); //PARENT CONSTRUCTOR
        this.speciality = speciality;
        this.work_hours = work_hours;
    }

    //CREATES A DATABASE ENTRY FOR EVERY STAFF SERVICE CREATED USING MOONGOOSE-MONGODB DATABASE HANDLER
    specify(user)
    {
        var newEvent = new servicebase({

            title:this.sup_id,
            type:this.type,
            price:this.price,
            artist:null,
            genre:null,
            cusine:null,
            head: null,
            special:this.speciality,
            hours:this.work_hours,
            organizer:user
        });
        servicebase.createService(newEvent, function(error, user){
            if(error)throw error;
            console.log(user);
        });

    }

}

module.exports = Staff;
