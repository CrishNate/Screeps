var Moving = require('moving');

var Upgrader = {

    /** @param {Creep} creep **/
    tick: function (creep, activity, targetID)
    {
        if (activity == 'upgrading')
        {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            {
                Moving.moveToOptimized(creep, creep.room.controller);
            }
        }
    }
};

module.exports = Upgrader;