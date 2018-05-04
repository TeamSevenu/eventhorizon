"use strict";

class Services{
    constructor(sup_id, price)
    {
        this.sup_id = sup_id;
        this.price = price;

    }

    //static service ID

    specify()
    {
        //gets overwritten by children
    }


}

module.exports = Services;
