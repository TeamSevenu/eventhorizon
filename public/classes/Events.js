
"use strict";

class Events{
    constructor(title, venue, date, status, org)
    {
        this.title = title;
        this.venue= venue;
        this.date = date;
        this.status= status;
        this.org = org;
        this.itemList = [0];
        this.serviceList = [0];
    }
    //static ID

    buyItem(item)
    {
        this.itemList.push(item);
        return(true);
    }

    buyService(service)
    {
        his.serviceList.push(service);
        return(true);
    }

    returnItem(item)
    {
        var itemindex = this.itemList.indexOf(item);
        //remove  index
        return true;
    }

    getTitle()
    {
        return(this.title);
    }

    getDate()
    {
        return(this.date);
    }
    getPrice(){
        return(this.price);
    }

    getVenue()
    {
        return(this.venue);
    }

    getOrg()
    {
        return(this.org);
    }

    getStatus(){

        return(this.status);
    }
}

module.exports = Events;
