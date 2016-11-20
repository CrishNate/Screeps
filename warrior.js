// Warrior.js
var Moving = require('moving');
var Finding = require('finding');

var Warrior = {
	
    tick: function (creep, activity, targetID) 
    {
        // getting sources
        var point = creep.memory.point;

        var targetDefence = undefined;

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

        //if (!point || (targetDefence
        //    && point.pos.x != targetDefence.pos.x
        //    && point.pos.y != targetDefence.pos.y
        //    && point.room != targetDefence.room))
        //{
        //    creep.say("defence");
        //    point = targetDefence;
        //    creep.memory.point = targetDefence;
        //}

        if (targetDefence)
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if (target && creep.pos.getRangeTo(target) < 15)
            {
                if (creep.attack(target) == ERR_NOT_IN_RANGE)
                {
                    creep.say("hey, stop!");
                    Moving.moveToOptimized(creep, target);
                }
            }
            else
            {
                Moving.moveToOptimized(creep, targetDefence);
            }
        }
    }
};

module.exports = Warrior;
