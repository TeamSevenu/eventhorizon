
"use strict";
//DATABASE HANDLERS AND INTERFACES REQUIRED FOR ACCESSING THE THIRD LAYER
var mailer = require("nodemailer");
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var userdatabase = require('../../Model/userdatabase.js');
var eventbase = require('../../Model/eventbase.js');

//USER CLASS ENCAPSULATES THE INFORMATION RELATED TO THE USER AND IS RESPONSIBLE FOR THE REGISTRATION
//HAS INFORMATION OF NAME, EMAIL, USERNAME, PASSWORD AND PHONE NUMBER
class User{
    constructor(name, email, username, password, phone)
    {
        this.name = name;
        this.email = email;
        this.username = username;
        this.pass= password;
        this.phone = phone;
    }

    //THIS METHOD CREATES A NEW USER DURING REGISTRATION ON FINDING NO DUPLICATES AND ADDS TO THE DATABASE USING
    //MONGOOSE-MONGODB HANDLER
    createUser(){
        //Creating Database Entry
        var newUser = new userdatabase({

            name:this.name,
            email:this.email,
            username: this.username,
            password:this.pass,
            phone:this.phone,

        });

        userdatabase.createUser(newUser, function(error, user){
            if(error)throw error;
            console.log(user);
        });

    }

    //THIS METHOD RETURNS ALL THE EVENTS CREATED BY A PARTICULAR USER, AS SUCH ALLOWS THEM TO VIEW HISTORY
    //THIS METHOD IS IN USER CLASS INSTEAD OF THE EVENT CLASS TO DIFFERENTIATE THIS SPECIFIC USER FUNCTIONALITY
    //FROM THE OTHER ONES IN THE EVENT CLASS DEALING WITH RETRIEVING EVENTS
    pastEvents(user, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("nodeauth");
            var query = {organizer: user };
            dbo.collection("eventbases").find(query).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                console.log(result);
                return callback(result);
            });
        });
    }

}

module.exports = User;
