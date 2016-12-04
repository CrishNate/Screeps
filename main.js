/*
 * Main
 * File where all the magic happening
 */

var m_Spawn = require("spawn");
var m_Creep = require("creeps");
var m_Source = require("source");
var m_Tower = require("tower");

if (!Memory.roads)
    Memory.roads = {};

if (!Memory.whitelist)
    Memory.whitelist = {};

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
	
    // CREEPS
    for (var index in Game.creeps)
    {
        var creep = Game.creeps[index];
		
        m_Creep.tick(creep);
    }

    // TOWERS
    for (var index in Game.structures)
    {
        var structure = Game.structures[index];

        if (structure.structureType == STRUCTURE_TOWER)
        {
            m_Tower.tick(structure);
        }
    }
}