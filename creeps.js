/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
 
// Creep.js

// params
var minTransportersAmount = 2;
var minUpgradersAmount = 2;
var minBuildersAmount = 2;

var Creep = {
    tick: function(creep)
    { }
};

module.exports = Creep;

var Miner = require("miner");
var Builder = require("builder");
var Upgrader = require("upgrader");
var Transport = require("transport");

Creep.tick = function(creep)
{
    var activity = creep.memory.activity;
    var type = creep.memory.type;
    var targetID = creep.memory.targetID;

    // Worker
    if (type == 'worker')
    {
        Builder.tick(creep, activity, targetID);
        Upgrader.tick(creep, activity, targetID);
        Transport.tick(creep, activity, targetID);
        Miner.tick(creep, activity, targetID);

        if (creep.carry.energy > 0)
        {
            if (activity == '')
            {
                var transportersAmount = 0;
                var upgradersAmount = 0;
                var builderAmount = 0;
                var freeAmount = 0;
                var busyAmount = 0;
                var allAmount = 0;

	            for (var index in Game.creeps)
	            {
	                var crep = Game.creeps[index];
	                var activ = crep.memory.activity;

	                if (activ == 'transporting') 
	                {
	                    transportersAmount += 1;
	                }

	                if (activ == 'upgrading') 
	                {
	                    upgradersAmount += 1;
	                }

	                if (activ == 'building') 
	                {
	                    builderAmount += 1;
	                }

	                if (activ == '')
	                {
	                    freeAmount += 1;
	                }
	            }
                
	            busyAmount = transportersAmount + upgradersAmount + builderAmount;
	            allAmount = busyAmount + freeAmount;
                
	            var structures = creep.room.find(FIND_STRUCTURES, {
	                filter: (structure) => { 
	                    return (structure.structureType == STRUCTURE_EXTENSION 
                            || structure.structureType == STRUCTURE_SPAWN 
                            || structure.structureType == STRUCTURE_TOWER) 
                            && structure.energy < structure.energyCapacity; 
	                }
                });
                
                var constructions = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

                if (creep.memory.activity == '' && constructions.length > 0 && (!structures.length || transportersAmount < Math.floor(allAmount / 4)))
                {
                    creep.say("building");
                    creep.memory.activity = 'building';
                }

                if (creep.memory.activity == '' && structures.length > 0 && (transportersAmount < minTransportersAmount || transportersAmount < (allAmount / 3)))
                {
                    creep.say("transport");
                    creep.memory.activity = 'transporting';
                }

                if (creep.memory.activity == '' && (upgradersAmount < minUpgradersAmount || upgradersAmount < (allAmount / 3)))
                {
                    creep.say("upgrading");
                    creep.memory.activity = 'upgrading';
                }
            }
        }
        else
        {
            if (activity !== 'mining')
            {
                creep.say("mining");
                creep.memory.activity = 'mining';
            }
        }
    }
};