"use strict";

//LOGIN IS A TESTING CLASS USED FOR CHECKING USER LOGIN FUNCTIONS
//AND STORING A LOGGED IN USERS SESSION

class Login{
    constructor()
    {
        //NO ATTRIBUTES
    }

    //SAVES THE USER CREDENTIALS WHEN THEY LOGIN
    loginAttempt(inputUsername, inputPass)
    {
        //Verify with database

        this.inputUsername= inputUsername;
        this.inputPass = inputPass;
    }

    //RETURNS THE USERNAME OF THE USER WHO IS CURRENTLY IN THE SESSION
    getUsername(){
        return(this.inputUsername);
    }

    //DISPLAYS THE USER INFORMATION ON THE CONSOLE FOR TESTING (USED AS STUB PRIOR)
    loginDetails(){
        console.log(this.inputEmail);
        console.log(this.inputPass);
    }

}

module.exports = Login;
