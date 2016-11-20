// Warrior.js
var Moving = require('moving');
var Finding = require('finding');

var Claimer = {

    tick: function (creep, activity, targetID) 
    { }
};

module.exports = Claimer;

Claimer.tick = function (creep, activity, targetID)
{
    var targetObj = Game.flags[targetID];

    if (!targetObj)
    {
        var availablePoints = []

        for (var index in Game.flags)
        {
            var flag = Game.flags[index];

            if (flag.memory.claim != null && !Game.getObjectById(flag.memory.claim))
            {
                flag.memory.claim = creep.id;
                creep.memory.targetID = flag.name;
                targetID = flag.name;
                targetObj = Game.flags[targetID];

                break;
            }
        }
    }

    if (targetObj)
    {
        var controller = creep.room.controller;

        console.log(creep.attackController(controller))

        if (controller && creep.reserveController(controller) == ERR_NOT_IN_RANGE)
        {
            //var result = creep.claimController(controller);
            Moving.moveToOptimized(creep, controller);
        }
        else if (!creep.pos.isNearTo(targetObj))
            Moving.moveToOptimized(creep, targetObj);
    }
};
