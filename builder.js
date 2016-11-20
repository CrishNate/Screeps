// Builder.js
var Moving = require('moving');
var Finding = require('finding');

var Builder = {
    tick: function (creep, activity, targetID) 
    { }
};

module.exports = Builder;

Builder.tick = function (creep, activity, targetID)
{
    /** @param {Creep} creep **/
    // Initialize target
    var targetObj = Game.getObjectById(targetID);
    var getSources = creep.memory.getSources;

    if (!targetObj && !creep.spawning)
    {
        var construct;

        if (!getSources)
        {
            //var structureBusy = { };

            //for (var index in Game.creeps)
            //{
            //    var eCreep = Game.creeps[index];

            //    if (eCreep.memory.activity == "builder" && eCreep.memory.repair)
            //        structureBusy[eCreep.memory.repair] = true;
            //}

            construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) => (i.structureType != STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART) && i.hits < i.hitsMax
                || (i.structureType == STRUCTURE_WALL && i.hits < 10000)
                || (i.structureType == STRUCTURE_RAMPART && i.hits < 25000 && i.my)
            });

            if (!construct)
            {
                construct = Finding.findClosestObjectTo(creep, Game.constructionSites, null);

                if (construct)
                    creep.memory.repair = construct.id;
            }

        }
        else
        {
            construct = Finding.findClosestObjectTo(creep, Game.structures, function(i) {
                return (i.energy > 0 
                    && i.structureType != STRUCTURE_SPAWN
                    && i.structureType != STRUCTURE_EXTENSION
                    && i.structureType != STRUCTURE_TOWER)
                    //|| (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > i.storeCapacity / 4)
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
                    return i.store[RESOURCE_ENERGY] > 200; // &&i.id != creep.memory.takedFrom;
                });
            }

            //if (!construct)
            //    construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //        filter: (i) => (i.energy > 0 
            //            && i.structureType != STRUCTURE_SPAWN
            //            && i.structureType != STRUCTURE_EXTENSION
            //            && i.structureType != STRUCTURE_TOWER)
            //            //|| (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > i.storeCapacity / 4)
            //            || (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 200)
            //    });

        }

        if (construct)
        {
            creep.memory.targetID = construct.id;
            targetID = construct.id;
            targetObj = Game.getObjectById(targetID);
        }
    }

    // Working with target
    if (targetObj)
    {
        if (!getSources)
        {
            var result = creep.build(targetObj);

            if (result == ERR_INVALID_TARGET)
                result = creep.repair(targetObj);

            if (result == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, targetObj, creep.room);
            }
            
            if(creep.carry.energy == 0)
            {
                creep.memory.targetID = '';
                creep.memory.getSources = true;
                creep.memory.repair = null;
            }
            else if(targetObj.hitsMax && targetObj.hits == targetObj.hitsMax)
            {
                creep.memory.targetID = '';
                creep.memory.repair = null;
            }
        }
        else
        {
            var result = creep.withdraw(targetObj, RESOURCE_ENERGY);

            if (result == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, targetObj, creep.room);
            }
            else if (creep.carry.energy == 0)
                    creep.memory.targetID = '';
        }
    }

    if (getSources && creep.carry.energy > 0)
    {
        creep.memory.targetID = '';
        creep.memory.getSources = false;
    }
};

/*

if (activity == 'repairing')
{
    // Initialize target
    var construction = Game.getObjectById(targetID)
    if (!construction
        || (construction && creep.repair(construction) == ERR_INVALID_TARGET))
    {
        var construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => { 
                return (structure.structureType == STRUCTURE_EXTENSION 
                    || structure.structureType == STRUCTURE_SPAWN 
                    || structure.structureType == STRUCTURE_ROAD
                    || structure.structureType == STRUCTURE_TOWER
                    || (structure.structureType == STRUCTURE_RAMPART && structure.hits < 25000)
                    || (structure.structureType == STRUCTURE_WALL && structure.hits < 10000)
                    || structure.structureType == STRUCTURE_CONTAINER) 
                    && structure.hits < structure.hitsMax; 
            }
        });

        if (construct)
        {
            creep.memory.targetID = construct.id;
            targetID = construct.id;
        }
        else
        {
            creep.memory.activity = '';
        }
    }

    // Working with target
    construction = Game.getObjectById(targetID);

    if (construction)
    {
        if (creep.repair(construction) == ERR_NOT_IN_RANGE)
        {
            Moving.moveToOptimized(creep, construction);
        }
                
        if (construction.hits == construction.hitsMax)
        {
            creep.memory.targetID = '';
        }
    }
    else
    {
        creep.memory.activity = '';
        creep.memory.targetID = '';
    }
}
*/