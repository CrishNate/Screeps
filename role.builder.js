var roleHarvester = require('role.harvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, idivar) {

	    if(creep.memory.activity !== 3 && creep.carry.energy == creep.carryCapacity)
		{
	        creep.memory.activity = 3;
			var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			creep.memory.target = target.id;
	    }

	    if(creep.memory.activity == 3)
		{
			var target = Game.getObjectById(creep.memory.target);
			
			if(target !== undefined && creep.carry.energy > 0)
			{
                if(creep.build(target) == ERR_NOT_IN_RANGE)
				{
                    creep.moveTo(target);
                }
            }
			else
			{
				creep.roleHarvester(idivar);
			}
	    }
	    else
		{
			creep.doHarvest(idivar);
		}

	}
};

module.exports = roleBuilder;