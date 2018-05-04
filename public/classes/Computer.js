
'use strict';

module.exports = Computer;

function Computer(owner)
{
    this.mouse = "razer";
    this.keyboard ="corsair";
    this.owner = "jayroop";



}

Computer.prototype.getkeyb = function()
{
    return this.keyboard;
};

Computer.prototype.saysomething = function ()
{
    console.log(this.mouse + this.keyboard + this.owner);
};
