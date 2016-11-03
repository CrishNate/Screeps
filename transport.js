/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
 
// Transporter.js

var Transporter = function(creep, room) {
  Creep.call(this, creep, room);
};

module.exports = Transporter;

Transporter.prototype = Creep.prototype;

Transporter.prototype.tick = function() {
  var creep = this.creep;
    if (creep.energy < creep.energyCapacity) {
        var miner = this.room.findByRole(creep, "miner");
        console.log(miner);
        if (miner !== null) {
            //console.log(miner[0].name);
            //creep.moveTo(miner);

        } else
            console.log("no miners found");
    } else {
        console.log("moving to drop");
        //var drop = find.nearestEnergyDropOff(creep);
        //creep.moveTo(drop);
        //creep.transferEnergy(drop);
    }
};