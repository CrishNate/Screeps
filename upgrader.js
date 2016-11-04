var Upgrader = {

    /** @param {Creep} creep **/
    tick: function (creep, activity, targetID)
    {
        if (activity == 'upgrading')
        {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = Upgrader;