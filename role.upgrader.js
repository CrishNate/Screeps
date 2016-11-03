require('doHarvest')

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, idivar)
	{
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else
		{
            creep.doHarvest(idivar);
        }
	}
};

module.exports = roleUpgrader;