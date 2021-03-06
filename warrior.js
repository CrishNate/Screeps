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

            if (flag.memory.squad)
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
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            //var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            //    filter: (i) => !i.owner || (i.owner && Memory.whitelist[i.owner.username])
            //});

            if (!target)
                target = targetDefence.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (i) => i.structureType != STRUCTURE_ROAD && i.structureType != STRUCTURE_CONTAINER && (!i.owner || (i.owner && !Memory.whitelist[i.owner.username]))
                });

            if (target && creep.pos.getRangeTo(target) < 25)
            {
                var result = creep.attack(target);

                if (result == ERR_NO_BODYPART)
                    result = creep.rangedAttack(target);

                if (result == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, target);
                }
                else if (result == OK && creep.pos.getRangeTo(target) < 3)
                {
                    var spawn = Finding.findClosestObjectTo(creep, Game.spawns);

                    Moving.moveToOptimized(creep, spawn);
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
