"use strict";

var service = require('./Services');

class Caterer extends service{
    constructor(sup_id, price, cusine, menu, headcount)
    {
        super(sup_id, price);
        this.cusine = cusine;
        this.menu = menu;
        this.headcount = headcount;

    }


}

module.exports = Caterer;
