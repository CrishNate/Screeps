var Moving = require('moving');
var Finding = require('finding');
var SourceInfo = require('source');

var Upgrader = {

    /** @param {Creep} creep **/
    tick: function (creep, activity, targetID)
    {
        var targetObj = Game.getObjectById(targetID);
        var getSources = creep.memory.getSources;

        if (!targetObj && !creep.spawning)
        {
            var target = null;

            if (!getSources)
            {
                var allControllers = [];

                for (var index in Game.spawns) 
                {
                    var spawn = Game.spawns[index];
                    if (spawn.room.controller)
                        allControllers.push(spawn.room.controller)
                }

                target = Finding.findClosestObjectTo(creep, allControllers);
            }
            else
            {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (i) => (i.energy > 0 
                        && i.structureType != STRUCTURE_SPAWN
                        && i.structureType != STRUCTURE_EXTENSION
                        && i.structureType != STRUCTURE_TOWER)
                        //|| (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > i.storeCapacity / 4)
                        || (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 200)
                });

                if (!target)
                {
                    var sources = creep.room.find(FIND_SOURCES);

                    for (var index in sources)
                    {
                        var source = sources[index];

                        if (source && SourceInfo.usingAmount(source, function(i) { return (i && i.memory.activity != "miner") }) < 1)
                        {
                            target = source;
                            SourceInfo.addUser(source, creep);
                            break;
                        }
                    }
                }
            }

            if (target)
            {
                creep.memory.targetID = target.id;
                targetID = target.id;
                targetObj = Game.getObjectById(targetID);
            }
        }

        if (targetObj)
        {
            if (!getSources)
            {
                var result = creep.upgradeController(targetObj);

                if (result == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, targetObj);
                }
                else if (creep.carry.energy == 0)
                {
                    creep.memory.targetID = '';
                    creep.memory.getSources = true;
                }
            }
            else
            {
                var result = creep.withdraw(targetObj, RESOURCE_ENERGY);

                if (result == ERR_INVALID_TARGET)
                    result = creep.harvest(targetObj);


                if (result == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, targetObj, creep.room);
                }
                else
                {
                    if (Memory.sources[targetObj.id] && _.sum(creep.carry) == creep.carryCapacity)
                        SourceInfo.removeUser(targetObj, creep);
                }
            }
        }

        if (getSources && creep.carry.energy > 0)
        {
            if (!targetObj || targetObj && (!Memory.sources[targetObj.id] || Memory.sources[targetObj.id] && _.sum(creep.carry) == creep.carryCapacity))
            {
                creep.memory.targetID = '';
                creep.memory.getSources = false;

                if (Memory.sources[targetObj.id])
                    SourceInfo.removeUser(targetObj, creep);
            }
        }
    }
};

module.exports = Upgrader;