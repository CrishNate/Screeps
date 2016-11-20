// Transporter.js
var Moving = require('moving');
var Finding = require('finding');

var Transporter = {
    tick: function (creep, activity, targetID) 
    { }
};

module.exports = Transporter;

Transporter.tick = function (creep, activity, targetID)
{
    // transporting sources
    var targetObj = Game.getObjectById(targetID);
    var transportSources = creep.memory.transportSources;

    // target found
    if (!targetObj && !creep.spawning)
    {
        var construct = undefined;
        //console.log(creep, "reset", transportSources);

        if (transportSources)
        {
            construct = Finding.findClosestObjectTo(creep, Game.structures, function(i) {
                return i.energy < i.energyCapacity;
            });

            if (!construct)
            {
                var allStorages = [];

                for (var index in Game.spawns) 
                {
                    var spawn = Game.spawns[index];
                    if (spawn.room.storage)
                        allStorages.push(spawn.room.storage)
                }

                construct = Finding.findClosestObjectTo(creep, allStorages, function(i) {
                    return i.store[RESOURCE_ENERGY] < i.storeCapacity; // &&i.id != creep.memory.takedFrom;
                });
            }

            if (!construct)
                construct = Finding.findClosestObjectTo(creep, Game.creeps, function(i) {
                    return i.carry.energy < i.carryCapacity / 2
                        && i.memory.activity != "miner"
                        && i.memory.activity != "transporter";
                });

            //console.log(creep.name, construct)
        }
        else
        {
            construct = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);

            //var creepBusy = { };

            //for (var index in Game.creeps)
            //{
            //    var eCreep = Game.creeps[index];

            //    if (eCreep.memory.activity == "transporter" && eCreep.memory.targetID 
            //        && ((Game.getObjectById(eCreep.memory.targetID).energy + creep.carry.energy) < creep.carryCapacity))
            //        creepBusy[eCreep.memory.targetID] = true;
            //}

            //if (!construct)
            //    construct = Finding.findClosestObjectTo(creep, Game.structures, function(i) {
            //        return i.structureType == STRUCTURE_CONTAINER
            //            && i.store[RESOURCE_ENERGY] > i.storeCapacity / 10;
            //    });

            if (!construct)
                construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (i) => i.structureType == STRUCTURE_CONTAINER
                        && i.store[RESOURCE_ENERGY] > i.storeCapacity / 10
                });

            if (!construct)
            {
                var creepBusy = { };

                for (var index in Game.creeps)
                {
                    var eCreep = Game.creeps[index];

                    if (eCreep.memory.activity == "transporter" && eCreep.memory.targetID)
                        creepBusy[eCreep.memory.targetID] = true;
                }

                construct = Finding.findClosestObjectTo(creep, Game.creeps, function(i) {
                    return i.memory.activity == "miner" && !creepBusy[i.id]
                        && i.carry.energy > i.carryCapacity / 2;
                });
            }

            //if (!construct)
            //    construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //        filter: (i) => i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity
            //    });
        }

        if (construct)
        {
            creep.memory.targetID = construct.id;
            targetID = construct.id;
            targetObj = Game.getObjectById(targetID);
        }
    }

    // Doing:
    if (targetObj)
    {
        if (transportSources)
        {
            var result = creep.transfer(targetObj, RESOURCE_ENERGY);

            if (result == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, targetObj, creep.room);
            }
            else
            {
                if (creep.carry.energy == 0)
                {
                    creep.memory.targetID = '';
                    creep.memory.takedFrom = '';
                    creep.memory.transportSources = false;
                }
                else
                    creep.memory.targetID = '';
            }
        }
        else
        {
            var result = creep.withdraw(targetObj, RESOURCE_ENERGY);
            var targetCapacity = 0;

            if (result == OK)
                targetCapacity = targetObj.store[RESOURCE_ENERGY]

            if (result == ERR_INVALID_TARGET 
                && targetObj.memory
                && targetObj.memory.activity == "miner")
            {
                targetCapacity = targetObj.carry.energy;

                if (targetCapacity == 0)
                    creep.memory.targetID = '';
                
                result = targetObj.transfer(creep, RESOURCE_ENERGY);
            }

            if (result == ERR_INVALID_TARGET)
            {
                result = creep.pickup(targetObj);
                targetCapacity = targetObj.energy;
            }

            if (result == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, targetObj, creep.room);
            }
            else
            {
                if (creep.carry.energy == 0 && targetCapacity == 0)
                    creep.memory.targetID = '';
                else
                {
                    creep.memory.targetID = '';
                    creep.memory.takedFrom = targetObj.id;
                    creep.memory.transportSources = true;
                }
            }
        }
    }
}

