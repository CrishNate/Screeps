/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvest');
 * mod.thing == 'a thing'; // true
 */

Creep.prototype.doHarvest = function(idivar)
{
	if(this.memory.activity !== 1)
	{
		this.memory.activity = 1;
		var target = this.pos.findClosestByPath(FIND_SOURCES);

		if (target !== undefined)
		{
			this.memory.target = target.id;
			this.memory.activity = 0;
		}
	}
	
	if(this.memory.target !== undefined)
	{
		var target = Game.getObjectById(this.memory.target);
		if(this.harvest(target) == ERR_NOT_IN_RANGE)
		{
			this.moveTo(target);
		}
	}
}

module.exports = { };

	//var sources = this.room.find(FIND_SOURCES);
	
	//var resource = idivar - Math.floor(idivar / sources.length) * sources.length

	//if(this.harvest(sources[resource]) == ERR_NOT_IN_RANGE)
	//{
	//	this.moveTo(sources[resource]);
	//}