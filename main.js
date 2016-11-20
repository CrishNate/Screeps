/*
 * Main
 * File where all the magic happening
 */

var m_Spawn = require("spawn");
var m_Creep = require("creeps");
var m_Source = require("source");

module.exports.loop = function ()
{
    for(var index in Game.spawns)
    {
        var spawn = Game.spawns[index];

        m_Spawn.tick(spawn);
    }

    if (Object.keys(Game.creeps).length < Object.keys(Memory.creeps).length)
    {
        for (var index in Memory.creeps)
        {
            if (!Game.creeps[index])
            {
                m_Source.updateUsers();
                delete Memory.creeps[index];
            }
        }
    }
	
    for (var index in Game.creeps)
    {
        var creep = Game.creeps[index];
		
        m_Creep.tick(creep);
    }
}