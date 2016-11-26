// Warrior.js
var Moving = require('moving');
var Finding = require('finding');
var SourceInfo = require('source');

var Scout = {

    tick: function (creep, activity, targetID) 
    { }
};

Scout.tick = function (creep, activity, targetID)
{
    var sources = creep.room.find(FIND_SOURCES, {filter: (i) => !SourceInfo.add(i, creep.room)});

    var targetObj = Game.flags[targetID];

    if (!targetObj && !creep.spawning)
    {
        var availablePoints = []

        for (var index in Game.flags)
        {
            var flag = Game.flags[index];

            if (flag.memory.scout != undefined && !Game.getObjectById(flag.memory.scout))
            {
                flag.memory.scout = creep.id;
                creep.memory.targetID = flag.name;
                targetID = flag.name;
                targetObj = Game.flags[targetID];

                break;
            }
        }
    }

    if (targetObj && !creep.pos.isNearTo(targetObj))
    {
        Moving.moveToOptimized(creep, targetObj);
    }
};

module.exports = Scout;
