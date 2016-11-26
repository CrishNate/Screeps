// Warrior.js
var Moving = require('moving');
var Finding = require('finding');

var Healer = {
	
    tick: function (creep, activity, targetID) 
    { }
};

Healer.tick = function (creep, activity, targetID)
{
    // getting sources
    var point = creep.memory.point;

    var targetDefence = null;

    var availablePoints = []
    for (var index in Game.flags)
    {
        var flag = Game.flags[index];

        if (flag.memory.defence)
        {
            availablePoints.push(flag);
        }
    }

    targetDefence = Finding.findClosestObjectTo(creep, availablePoints);

    if (targetDefence)
    {
        var target = Finding.findClosestObjectTo(creep, Game.creeps, function (i) {
            return i.hits < i.hitsMax;
        });

        if (target)
        {
            if (creep.heal(target) == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, target);
            }
        }
        else
        {
            Moving.moveToOptimized(creep, targetDefence);
        }
    }
};

module.exports = Healer;
