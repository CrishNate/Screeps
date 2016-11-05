// Warrior.js
var Moving = require('moving');

var Warrior = {
	
    tick: function (creep, activity, targetID) 
    {
        // getting sources
        if (activity == 'idle')
        {
            // transporting sources
            var point = creep.memory.point;

            if (!point)
            {
                var flag = creep.pos.findClosestByRange(FIND_FLAGS);

                if (flag)
                {
                    creep.say("defence");
                    point = flag;
                    creep.memory.point = flag;
                }
            }
            else
            {
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
                if (target && creep.pos.getRangeTo(target) < 15)
                {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.say("hey");
                        Moving.moveToOptimized(creep, target);
                    }
                }
                else
                {
                    //Moving.moveToOptimized(creep, point, creep.room);
                    Moving.moveToOptimizedXY(creep, point.pos.x, point.pos.y, point.room.name);
                }
            }
        }
    }
};

module.exports = Warrior;
