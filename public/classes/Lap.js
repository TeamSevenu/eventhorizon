
"use strict";



class Lap{

    constructor(name){
        this.name = name;
    }

    register(){
        console.log(this.name + "hi");
    }
}

module.exports = Lap;
