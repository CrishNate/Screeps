require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
require('spawn');

var minimumHarvestersCount = 10;
var minimumUpgradersCount = 4;
var minimumBuildersCount = 6;
var minimumWarriorsCount = 6;

var spawnersCountLast = 0;

module.exports.loop = function ()
{

    for(var index in Game.spawns)
	{
		var spawn = Game.spawns[index];
		
		if(!spawn.memory.placed)
		{
			spawn.createRoads();
			spawn.memory.placed = true;
		}
		
		spawn.createCreeps();
	}
	
	var idivar = 0;
    for (var index in Game.creeps)
	{
        var creep = Game.creeps[index];
        
        if(creep.memory.role == 'harvester')
		{
            creep.roleHarvester(idivar);
        }
		
        if(creep.memory.role == 'upgrader') 
		{
            roleUpgrader.run(creep, idivar);
        }
		
        if(creep.memory.role == 'builder')
		{
            roleBuilder.run(creep, idivar);
        }
		
		if(creep.memory.role == 'warrior')
		{
            roleWarrior.run(creep, idivar);
        }
		
		idivar += 1;
    }
	
	for (let index in Memory.creeps)
	{
		if(Game.creeps[index] == undefined)
		{
			delete Memory.creeps[index];
		}
	}
}