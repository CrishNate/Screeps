require('doHarvest');

Creep.prototype.roleHarvester = function(idivar){
	
	if(this.carry.energy < this.carryCapacity)
	{
		this.doHarvest(idivar);
	}
	else
	{		
		var targets = this.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
				}
		});
		
		if(targets.length > 0)
		{
			if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			{
				this.moveTo(targets[0]);
			}
			
			if(this.memory.activity !== 4)
			{
				this.memory.activity = 4;
				var target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
				this.memory.target = target.id;
			}
		}
	}
};

module.exports = { };