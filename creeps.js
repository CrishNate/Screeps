/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
 
// Creep.js

// params

var Miner = require("miner");
var Builder = require("builder");
var Upgrader = require("upgrader");
var Transport = require("transport");
var Warrior = require("warrior");
var Scout = require("scout");
var Claimer = require("claimer");
var Healer = require("healer");
var Tank = require("tank");

var Finding = require("finding");
var Moving = require('moving');
var Spawn = require('spawn');

var Creep = {
    tick: function(creep)
    { },
    renew: function(creep)
    { },
};

module.exports = Creep;

Creep.tick = function(creep)
{
    var activity = creep.memory.activity;
    var targetID = creep.memory.targetID;

    this.renew(creep);

    if (!creep.memory.fixme)
    {
        if (activity == "miner")
            Miner.tick(creep, activity, targetID);

        if (activity == "transporter")
            Transport.tick(creep, activity, targetID);

        if (activity == "upgrader")
            Upgrader.tick(creep, activity, targetID);

        if (activity == "builder")
            Builder.tick(creep, activity, targetID);

        if (activity == "warrior")
            Warrior.tick(creep, activity, targetID);

        if (activity == "scout")
            Scout.tick(creep, activity, targetID);

        if (activity == "claimer")
            Claimer.tick(creep, activity, targetID);

        if (activity == "healer")
            Healer.tick(creep, activity, targetID);

        if (activity == "tank")
            Tank.tick(creep, activity, targetID);
    }
};

Creep.renew = function(creep)
{
    // transporting sources
    var targetObj = Game.getObjectById(creep.memory.secondTarget);

    // target found
    if (!creep.spawning && creep.ticksToLive < 300 && creep.memory.activity != "claimer" || creep.memory.fixme)
    {
        var spawn = Finding.findClosestObjectTo(creep, Game.spawns, function (i) {
            return Spawn.getAmountOfAllEnergy(i) > 100;
        });

        if (spawn)
        {
            creep.memory.secondTarget = spawn.id;
            targetObj = spawn;
            creep.memory.fixme = true;
        }
        else
            creep.memory.fixme = false;
    }

    if (targetObj && targetObj.structureType == STRUCTURE_SPAWN && creep.memory.fixme)
    {
        Moving.moveToOptimized(creep, targetObj);

        var result = targetObj.renewCreep(creep);

        if (creep.ticksToLive > 600)
        {
            creep.memory.fixme = false;
        }
    }
}