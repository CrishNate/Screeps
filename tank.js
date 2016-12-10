// Tank.js
var Moving = require('moving');
var Finding = require('finding');

var Warrior = {
	
    tick: function (creep, activity, targetID) 
    {
        // getting sources
        var point = creep.memory.point;

        var targetDefence = undefined;

        var availablePoints = []
        var availablePoints2 = []

        for (var index in Game.flags)
        {
            var flag = Game.flags[index];

            if (flag.memory.tank)
            {
                availablePoints.push(flag);
            }

            if (flag.memory.squad)
            {
                availablePoints2.push(flag);
            }
        }

        //if (!point || (targetDefence
        //    && point.pos.x != targetDefence.pos.x
        //    && point.pos.y != targetDefence.pos.y
        //    && point.room != targetDefence.room))
        //{
        //    creep.say("defence");
        //    point = targetDefence;
        //    creep.memory.point = targetDefence;
        //}


        if (creep.hits < creep.hitsMax / 10)
        {
            targetDefence = Finding.findClosestObjectTo(creep, availablePoints2);
        }
        else
        {
            targetDefence = Finding.findClosestObjectTo(creep, availablePoints);
        }

        if (targetDefence)
            Moving.moveToOptimized(creep, targetDefence);
    }
};

module.exports = Warrior;
