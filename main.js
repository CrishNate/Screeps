/*
 * Main
 * File where all the magic happening
 */

require('spawn');
var m_Creep = require('creeps');
var m_Source = require('source');

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
	
    for (let index in Memory.creeps)
    {
        //console.log(Memory.creeps[index].id);

	    if (!Game.creeps[index])
		{
		    m_Source.updateUsers();
			delete Memory.creeps[index];
		}
	}
	
    for (var index in Game.creeps)
	{
        var creep = Game.creeps[index];
		
        m_Creep.tick(creep);
    }
}