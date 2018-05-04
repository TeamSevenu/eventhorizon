"use strict";

var service = require('./Services');

class Staff extends service{
    constructor(sup_id, price, speciality, work_hours)
    {
        super(sup_id, price);
        this.speciality = speciality;
        this.work_hours = work_hours;
    }


}

module.exports = Staff;
