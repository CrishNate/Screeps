require('doHarvest')

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, idivar)
	{
	    if(creep.memory.activity !== 2 && creep.carry.energy == creep.carryCapacity)
		{
	        creep.memory.activity = 2;
	    }

	    if(creep.memory.activity == 2)
		{
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
			{
                creep.moveTo(creep.room.controller);
            }
			
			if(creep.carry.energy == 0)
			{
				creep.memory.activity = 1;
			}
        }
        else
		{
            creep.doHarvest(idivar);
        }
	}
};

module.exports = roleUpgrader;