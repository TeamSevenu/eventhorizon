"use strict";

//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var service = require('./Services');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var servicebase = require('../../Model/servicebase.js');


//CATERER CLASS IS A SUBCLASS OF SERVICE AND INHERITS ITS FIELDS AND METHODS
class Caterer extends service{
    constructor(sup_id, type, price, cusine, menu, headcount)
    {
        super(sup_id, type,  price); //PARENT CONSTRUCTOR
        this.cusine = cusine;
        this.menu = menu;
        this.headcount = headcount;

    }

    //OVERWRITES THE SPECIFY FIELD IN THE SERVICE PARENT CLASS
    //CREATES A DATABASE ENTRY FOR EVERY ENTERTAINER SERVICE CREATED USING MOONGOOSE-MONGODB DATABASE HANDLER
    specify(user){
    var newEvent = new servicebase({

        title:this.sup_id,
        type:this.type,
        price:this.price,
        artist:null,
        genre:null,
        cusine:this.cusine,
        head: this.headcount,
        special:null,
        hours:null,
        organizer:user
    });
    servicebase.createService(newEvent, function (error, user) {
        if (error) throw error;
        console.log(user);
    })};
}

module.exports = Caterer;
