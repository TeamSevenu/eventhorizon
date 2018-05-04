"use strict";

var service = require('./Services');

class Entertainer extends service{
    constructor(sup_id, price, artist_name, genre)
    {
        super(sup_id, price);
        this.artist_name = artist_name;
        this.genre = genre;
    }


}

module.exports = Entertainer;
