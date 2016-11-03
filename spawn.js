/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

var minimumHarvestersCount = 10;
var minimumUpgradersCount = 4;
var minimumBuildersCount = 6;

Spawn.prototype.createConstructionSites = function(path, constuction)
{
    for(var index in path)
    {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        if(this.room.lookForAt('structure', roomPosition).length == 0 && this.room.lookForAt('constructionSite', roomPosition).length == 0)
        {
            this.room.createConstructionSite(roomPosition, constuction);   
        }
    }
}

Spawn.prototype.createRoads = function()
{
	var sources = this.room.find(FIND_SOURCES);
	
	//for (var index in sources)
	//{
		//var source = sources[index];
		var source = this.pos.findClosestByPath(FIND_SOURCES);
		var path = this.room.findPath(source.pos, this.pos, {ignoreRoads: true, ignoreCreeps: true})
		this.createConstructionSites(path, STRUCTURE_ROAD)
		
		path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps: true})
		this.createConstructionSites(path, STRUCTURE_ROAD)
		
		path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps: true})
		this.createConstructionSites(path, STRUCTURE_ROAD)
	//}
}


Spawn.prototype.createCreeps = function(spawn)
{
	var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester')
	var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader')
	var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder')

	var name = undefined;
	
	if (numberOfHarvesters < minimumHarvestersCount && numberOfUpgraders >= numberOfHarvesters && numberOfBuilders >= numberOfHarvesters)
	{
		name = this.createCreep([WORK, MOVE, CARRY, CARRY], undefined,
			{role: 'harvester'})
			
		if(name > 0)
		{
			console.log("Created harvester:" + name);
		}
	}
	else
	{
		if (numberOfUpgraders < minimumUpgradersCount && numberOfBuilders >= numberOfUpgraders)
		{
			name = this.createCreep([WORK, MOVE, CARRY], undefined,
				{role: 'upgrader'})
			
			if(name > 0)
			{
				console.log("Created upgrader:" + name);
			}
		}
		else
		{
			if (numberOfBuilders < minimumBuildersCount)
			{
				name = this.createCreep([WORK, MOVE, CARRY], undefined,
					{role: 'builder'})
					
				if(name > 0)
				{
					console.log("Created builder:" + name);
				}
			}
		}
	}
}

module.exports = { };