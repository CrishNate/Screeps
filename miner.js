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
    var targetObj;

    if(Memory.sources[targetID])
        targetObj = Game.getObjectById(targetID);

    if (!targetObj && !creep.spawning)
    {
        //var sources = creep.room.find(FIND_SOURCES);
        var sourceFindResult;

        for (var index in Memory.sources)
        {
            var source = Memory.sources[index].source;

            if (source && SourceInfo.usingAmount(source) < 1 && SourceInfo.usingAmount(source) !== -1)
                sourceFindResult = source;
        }

        if (sourceFindResult)
        {
            creep.memory.targetID = sourceFindResult.id;
            targetID = sourceFindResult.id;
            targetObj = Game.getObjectById(targetID);
            var error = SourceInfo.addUser(sourceFindResult, creep);
        }
    }

    if (targetObj)
    {
        var objContainer = Game.getObjectById(creep.memory.container);

        if(!creep.memory.container)
        {
            var container = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => { return structure.structureType == STRUCTURE_CONTAINER; }
            });
            
            if (container[0])
                creep.memory.container = container[0].id;
        }


        if (objContainer)
            creep.transfer(objContainer, RESOURCE_ENERGY);

        if (creep.carry.energy < creep.carryCapacity)
        {
            var result = creep.harvest(targetObj);

            if (result == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, targetObj);
            }
        }
    }
    else if (Memory.sources[targetID] && !Game.getObjectById(targetID))
    {
        Moving.moveToOptimized(creep, new RoomPosition(Memory.sources[targetID].pos.x, Memory.sources[targetID].pos.y, Memory.sources[targetID].pos.room));
    }
}