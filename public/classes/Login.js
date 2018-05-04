"use strict";


class Login{
    constructor()
    {
        this.cookie_id =0;
    }

    loginAttempt(inputUsername, inputPass)
    {
        //Verify with database

        this.inputUsername= inputUsername;
        this.inputPass = inputPass;
    }

    getUsername(){
        return(this.inputUsername);
    }
    loginDetails(){
        console.log(this.inputEmail);
        console.log(this.inputPass);
    }
    getCookie()
    {
        return this.cookie_id;
    }

    incrementCookie()
    {
        this.cookie_id++;
    }
}

module.exports = Login;
