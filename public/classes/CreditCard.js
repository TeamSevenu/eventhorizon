
"use strict";

class CreditCard {
    constructor(holdername, expiry, cardnumber, cvv, type)
    {
     this.holdername = holdername;
     this.expiry = expiry;
     this.cardnumber = cardnumber;
     this.cvv = cvv;
     this.type = type;
    }

    //static transaction ID

   validate(){

        //validates with bank?
   }

}

module.exports = CreditCard;
