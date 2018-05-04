
"use strict";

var user = require('./User');

class Organizer extends user{
    constructor(username, email, phone, pass, user_ID, type, org_ID)
    {
       super(username, email, phone, pass, user_ID, type);
       this.org_ID = org_ID;
    }

    showEvents()
    {
        return("I SOW U EVENT");
    }

    showActiveEvents() {
        return ("NO. EVENT");
    }

    modifyEvent(event_ID, detail, new_detail)
    {
        return(event_ID + " with ID Event has changed from" + detail + " to "+ new_detail );
    }
}


module.exports = Organizer;
