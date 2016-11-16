var Moving = require('moving');
var Finding = require('finding');

var Upgrader = {

    /** @param {Creep} creep **/
    tick: function (creep, activity, targetID)
    {
        if (activity == 'upgrading')
        {
            var controller = Game.getObjectById(creep.memory.targetID);

            if (creep.upgradeController(controller) != OK)
            {
                var allControllers = [];

                for (var index in Game.spawns) 
                {
                    var spawn = Game.spawns[index];
                    if (spawn.room.controller)
                        allControllers.push(spawn.room.controller)
                }

                creep.memory.targetID = Finding.findClosestObjectTo(creep, allControllers);
                controller = creep.memory.targetID;
            }

 
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, controller);
            }
        }
    }
};

module.exports = Upgrader;