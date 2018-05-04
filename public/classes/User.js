
"use strict";
var mailer = require("nodemailer");

class User{
    constructor(name, username,  pass, email, phone, user_ID, type)
    {
        this.name = name;
        this.username = username;
        this.pass= pass;
        this.email = email;
        this.phone = phone;
        this.user_ID = user_ID;
        this.type= type;
    }

    details()
    {
        console.log(this.name);
        console.log(this.username);
        console.log(this.pass);
        console.log(this.email);
        console.log(this.phone);
        console.log(this.type);
    }

    getName()
    {
        return(this.name);
    }
    getUsername()
    {
        return(this.username);
    }

    getPass()
    {
        return(this.pass);
    }
    getEmail()
    {
        return(this.email);
    }
    getPhone()
    {
        return(this.phone);
    }
    getType(){
        return(this.type);
    }
    getUserID()
    {
        return(this.user_ID);
    }


}

module.exports = User;
