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
	var sources = this.room.find(FIND_SOURCES);
	
	var resource = idivar - Math.floor(idivar / sources.length) * sources.length

	if(this.harvest(sources[resource]) == ERR_NOT_IN_RANGE)
	{
		this.moveTo(sources[resource]);
	}
}

module.exports = { };