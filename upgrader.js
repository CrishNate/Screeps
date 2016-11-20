var Moving = require('moving');
var Finding = require('finding');

var Upgrader = {

    /** @param {Creep} creep **/
    tick: function (creep, activity, targetID)
    {
        var targetObj = Game.getObjectById(targetID);
        var getSources = creep.memory.getSources;

        if (!targetObj && !creep.spawning)
        {
            var construct = undefined;

            if (!getSources)
            {
                var allControllers = [];

                for (var index in Game.spawns) 
                {
                    var spawn = Game.spawns[index];
                    if (spawn.room.controller)
                        allControllers.push(spawn.room.controller)
                }

                construct = Finding.findClosestObjectTo(creep, allControllers);
            }
            else
            {
                construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (i) => (i.energy > 0 
                        && i.structureType != STRUCTURE_SPAWN
                        && i.structureType != STRUCTURE_EXTENSION
                        && i.structureType != STRUCTURE_TOWER)
                        //|| (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > i.storeCapacity / 4)
                        || (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 200)
                });
            }

            if (construct)
            {
                creep.memory.targetID = construct.id;
                targetID = construct.id;
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
    }
};

module.exports = Upgrader;