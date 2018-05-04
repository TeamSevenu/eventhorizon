
"use strict";

var user = require('./User');

class Customer extends user{
    constructor(username, email, phone, pass, user_ID, type, org_ID, card)
    {
        super(username, email, phone, pass, user_ID, type);
        this.card = card;
        this.ticketList = [0];
    }

    showTickets()
    {

        return("KOE NO KATACHI");

    }

    buyTickets() {
        return ("Ticket Brought! Congrats");
    }

}
module.exports = Customer;
