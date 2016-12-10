var Moving = require('moving');
var SourceInfo = require('source');
var Finding = require('finding');

var Miner = {
    tick: function (creep, activity, targetID) 
    { }
};

module.exports = Miner;

Miner.tick = function (creep, activity, targetID)
{
    // Initialize target
    var targetObj = Game.getObjectById(targetID);

    //if(Memory.sources[targetID])
    //    targetObj = Game.getObjectById(targetID);

    if (!targetObj && !creep.spawning)
    {
        var findTarget;

        if (creep.carry.energy < creep.carryCapacity)
        {
            //var sources = creep.room.find(FIND_SOURCES);
            for (var index in Memory.sources)
            {
                var source = Memory.sources[index].source;

                if (source && SourceInfo.usingAmount(source, function(i) { return (!i || i && i.memory.activity == "miner") }) < 1)
                {
                    findTarget = source;
                    break;
                }
            }

            if (findTarget)
                SourceInfo.addUser(findTarget, creep);
        }
        else
        {
            construct = Finding.findClosestObjectTo(creep, Game.structures, function(i) {
                return (i.structureType == STRUCTURE_SPAWN 
                    || i.structureType == STRUCTURE_EXTENSION) && i.energy < i.energyCapacity;
            });

            if (!construct)
                construct = Finding.findClosestObjectTo(creep, Game.structures, function(i) {
                    return i.energy < i.energyCapacity;
                });

            if (!findTarget)
                findTarget = Finding.findClosestObjectTo(creep, Game.structures, function(i) {
                    return i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity;
                });

            if (!findTarget)
                findTarget = Finding.findClosestObjectTo(creep, Game.creeps, function(i) {
                    return i.carry.energy < i.carryCapacity / 2
                        && i.memory.activity != "miner"
                        && i.memory.activity != "transporter";
                });
        }

        if (findTarget)
        {
            creep.memory.targetID = findTarget.id;
            targetID = findTarget.id;
            targetObj = Game.getObjectById(targetID);
        }
    }

    if (targetObj)
    {
        if (Memory.sources[targetObj.id])
        {
            if (creep.carry.energy < creep.carryCapacity)
            {
                var result = creep.harvest(targetObj);

                if (result == ERR_NOT_IN_RANGE)
                    Moving.moveToOptimized(creep, targetObj);
                else if(result == OK)
                {
                    var objContainer = Game.getObjectById(creep.memory.container);

                    if (objContainer)
                    {
                        var result = creep.transfer(objContainer, RESOURCE_ENERGY);

                        if (result == ERR_NOT_IN_RANGE)
                        {
                            creep.memory.container = undefined;
                            objContainer = undefined;
                        }
                    }

                    if(!objContainer || objContainer && _.sum(objContainer.store) == objContainer.storeCapacity)
                    {
                        //console.log(creep.name, objContainer);

                        var container = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                            filter: (i) => i.structureType == STRUCTURE_CONTAINER && _.sum(i.store) != i.storeCapacity
                        });
            
                        if (container[0])
                        {
                            creep.memory.container = container[0].id;
                            objContainer = container[0];
                            creep.transfer(objContainer, RESOURCE_ENERGY);
                        }
                    }
                }

            }
            else
            {
                SourceInfo.removeUser(targetObj, creep);
                creep.memory.targetID = '';
            }
        }
        else
        {
            var result = creep.transfer(targetObj, RESOURCE_ENERGY);

            if (result == ERR_NOT_IN_RANGE)
                Moving.moveToOptimized(creep, targetObj);

            if ((targetObj.energy && (targetObj.energy == targetObj.energyCapacity)) 
                || (targetObj.store && (_.sum(targetObj.store) == targetObj.storeCapacity)) 
                || (targetObj.carry && (_.sum(targetObj.carry) == targetObj.carryCapacity)))
                creep.memory.targetID = '';

            if (creep.carry.energy == 0)
                creep.memory.targetID = '';
        }
    }
    else if (Memory.sources[targetID] && !Game.getObjectById(targetID))
        Moving.moveToOptimized(creep, new RoomPosition(Memory.sources[targetID].pos.x, Memory.sources[targetID].pos.y, Memory.sources[targetID].pos.room));
}