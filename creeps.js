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

var Miner = require("miner");
var Builder = require("builder");
var Upgrader = require("upgrader");
var Transport = require("transport");
var Warrior = require("warrior");
var Scout = require("scout");
var Claimer = require("claimer");

var Creep = {
    tick: function(creep)
    { }
};

module.exports = Creep;

Creep.tick = function(creep)
{
    var activity = creep.memory.activity;
    var targetID = creep.memory.targetID;

    if (activity == "miner")
        Miner.tick(creep, activity, targetID);

    if (activity == "transporter")
        Transport.tick(creep, activity, targetID);

    if (activity == "upgrader")
        Upgrader.tick(creep, activity, targetID);

    if (activity == "builder")
        Builder.tick(creep, activity, targetID);

    if (activity == "warrior")
        Warrior.tick(creep, activity, targetID);

    if (activity == "scout")
        Scout.tick(creep, activity, targetID);

    if (activity == "claimer")
        Claimer.tick(creep, activity, targetID);

    //if (type == 'worker')
    //{
    //    if (creep.carry.energy > 0)
    //    {
    //        if (activity == '')
    //        {
    //            var transportersAmount = 0;
    //            var upgradersAmount = 0;
    //            var builderAmount = 0;
    //            var scoutsAmount = 0;

    //            var freeAmount = 0;
    //            var busyAmount = 0;
    //            var allAmount = 0;

	//            for (var index in Game.creeps)
	//            {
	//                var crep = Game.creeps[index];
	//                var activ = crep.memory.activity;

	//                if (activ == 'scouting') 
	//                    scoutsAmount += 1;

	//                if (activ == 'transporting') 
	//                    transportersAmount += 1;

	//                if (activ == 'upgrading') 
	//                    upgradersAmount += 1;

	//                if (activ == 'building' || activ == 'repairing') 
	//                    builderAmount += 1;

	//                if (activ == '')
	//                    freeAmount += 1;
	//            }
                
	//            busyAmount = transportersAmount + upgradersAmount + builderAmount;
	//            allAmount = busyAmount + freeAmount;
                
	//            var scoutingPoints = []
	//            for (var index in Game.flags) 
	//            {
	//                var flag = Game.flags[index];

	//                if (flag.memory.scout) 
	//                {
	//                    scoutingPoints.push(flag);
	//                }
	//            }

	//            var constructions = creep.room.find(FIND_MY_STRUCTURES, {
	//                filter: (structure) => { return structure.energy < structure.energyCapacity; }
    //            });
                
    //            var constructionsRepair = creep.room.find(FIND_STRUCTURES, {
	//                filter: (structure) => { 
	//                    return (structure.structureType == STRUCTURE_EXTENSION 
    //                        || structure.structureType == STRUCTURE_SPAWN 
    //                        || structure.structureType == STRUCTURE_ROAD
    //                        || structure.structureType == STRUCTURE_TOWER
    //                        || (structure.structureType == STRUCTURE_RAMPART && structure.hits < 25000)
    //                        || (structure.structureType == STRUCTURE_WALL && structure.hits < 10000)
    //                        || structure.structureType == STRUCTURE_CONTAINER) 
    //                        && structure.hits < structure.hitsMax; 
	//                }
    //            });           

    //            var structures = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

    //            if (creep.memory.activity == '' && scoutingPoints.length > 0 && scoutsAmount < scoutingPoints.length)
    //            {
    //                creep.memory.activity = 'scouting';
    //            }

    //            if (creep.memory.activity == '' && constructions.length > 0 && (transportersAmount < minTransportersAmount || transportersAmount < Math.floor(allAmount / 3)))
    //            {
    //                //creep.say("transport");
    //                creep.memory.activity = 'transporting';
    //            }

    //            if (creep.memory.activity == '' 
    //                && ((constructions.length == 0 && constructionsRepair.length == 0 && structures.length == 0)
    //                || upgradersAmount < minUpgradersAmount /*|| upgradersAmount < Math.floor(allAmount / 5)*/)
    //            )
    //            {
    //                //creep.say("upgrading");
    //                creep.memory.activity = 'upgrading';
    //            }

    //            if (creep.memory.activity == '' && constructionsRepair.length > 0 && (structures.length == 0 || constructions.length == 0 || builderAmount < Math.floor(allAmount / 6)))
    //            {
    //                //creep.say("repairing");
    //                creep.memory.activity = 'repairing';
    //            }
                
    //                if (creep.memory.activity == '' && structures.length > 0 && (constructionsRepair.length == 0 || constructions.length == 0 || builderAmount < Math.floor(allAmount / 6)))
    //            {
    //                //creep.say("building");
    //                creep.memory.activity = 'building';
    //            }
    //        }
    //    }
    //    else
    //    {
    //        if (activity !== 'mining')
    //        {
    //            //creep.say("mining");
    //            creep.memory.activity = 'mining';
    //        }
    //    }

    //    Builder.tick(creep, activity, targetID);
    //    Upgrader.tick(creep, activity, targetID);
    //    Transport.tick(creep, activity, targetID);
    //    Miner.tick(creep, activity, targetID);
    //    Scout.tick(creep, activity, targetID);
    //}

    //if (type == 'warrior')
    //{
    //    Warrior.tick(creep, activity, targetID);
    //}
};