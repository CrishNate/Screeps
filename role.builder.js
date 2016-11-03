var roleHarvester = require('role.harvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, idivar) {

	    if(creep.memory.building && creep.carry.energy == 0)
		{
            creep.memory.building = false;
	    }
		
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity)
		{
	        creep.memory.building = true;
			var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			creep.memory.constructTarget = target.id;
	    }

	    if(creep.memory.building)
		{
			var target = Game.getObjectById(creep.memory.constructTarget);

			if(targets.length)
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