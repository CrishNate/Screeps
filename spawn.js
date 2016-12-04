/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
var SourceInfo = require('source');

const BPCost = {
    work: 100
    , move: 50
    , carry: 50
    , attack: 80
    , ranged_attack: 150
    , heal: 250
    , claim: 600
    , tough: 10
};

const MAXBODYPARTS = 50;

var Spawn = {
    init: function (spawn)
    { },
    tick: function (spawn)
    { },
    getAmountOfAllEnergy: function (spawn)
    { },
    spawningCreep: function (spawn, bodyparts, bodypartsCount, energy, memory)
    { },
    createRoadTo: function (object1, object2)
    { },
};

var createConstructionSites = function (object, path, constuction) 
{
    for (var index in path) 
    {
        var item = path[index];
        var roomPosition = object.room.getPositionAt(item.x, item.y);
        if (object.room.lookForAt('structure', roomPosition).length == 0 && object.room.lookForAt('constructionSite', roomPosition).length == 0) 
        {
            object.room.createConstructionSite(roomPosition, constuction);
        }
    }
}

Spawn.createRoadTo = function (object1, object2)
{
    var path = object1.room.findPath(object1.pos, object2.pos, { ignoreRoads: true, ignoreCreeps: true })
    createConstructionSites(object1, path, STRUCTURE_ROAD)
}

var createRoads = function (spawn) 
{
    var sources = spawn.room.find(FIND_SOURCES);

    for (var index in sources)
    {
        var source = sources[index];
        var path = spawn.room.findPath(source.pos, spawn.pos, { ignoreRoads: true, ignoreCreeps: true })
        createConstructionSites(spawn, path, STRUCTURE_ROAD)
    }

    var path = spawn.room.findPath(spawn.pos, spawn.room.controller.pos, { ignoreRoads: true, ignoreCreeps: true })
    createConstructionSites(spawn, path, STRUCTURE_ROAD)
}

var findSources = function (spawn)
{
    var sources = spawn.room.find(FIND_SOURCES);

    for (var index in sources)
    {
        var source = sources[index];
        SourceInfo.add(source);
        console.log(source);
    }
}
//Spawn.prototype.createRoadTo = function (object) 
//{
//    console.log(object);
//    var path = this.room.findPath(object.pos, this.pos, { ignoreRoads: true, ignoreCreeps: true })
//    console.log(path);
//    this.createConstructionSites(path, STRUCTURE_ROAD)
//}

Spawn.init = function (spawn)
{
    //createRoads(spawn);
    findSources(spawn);
}

Spawn.tick = function (spawn)
{
    if (!spawn.memory.init)
    {
        spawn.memory.init = true;
        this.init(spawn);
    }

    if (!spawn.spawning)
    {
        var amountMiner = 0;
        var amountTransporters = 0;
        var amountUpgraders = 0;
        var amountBuilders = 0;
        var amountWarriors = 0;
        var amountHealers = 0;
        var amountScout = 0;
        var amountClaimer = 0;

        var needScouts = 0;
        var needClaimers = 0;
        var needSquads = 0;

        var amoutOfExtencions = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION) }
        }).length;
        var amoutOfMaxEnergyInRoom = amoutOfExtencions * 50 + 300;

        var energy = this.getAmountOfAllEnergy(spawn);

        for (var index in Game.flags)
        {
            var flag = Game.flags[index];

            if (flag.memory.scout)
                needScouts += 1;

            if (flag.memory.claim)
                needClaimers += 1;

            if (flag.memory.squad)
                needSquads += 1;
        }

        var amountSources = Object.keys(Memory.sources).length;

        for (var index in Game.creeps)
        {
            var creep = Game.creeps[index];

            if (creep.memory.activity == "miner")
                amountMiner += 1;

            if (creep.memory.activity == "transporter")
                amountTransporters += 1;

            if (creep.memory.activity == "upgrader")
                amountUpgraders += 1;

            if (creep.memory.activity == "builder")
                amountBuilders += 1;

            if (creep.memory.activity == "warrior")
                amountWarriors += 1;

            if (creep.memory.activity == "healer")
                amountHealers += 1;

            if (creep.memory.activity == "scout")
                amountScout += 1;

            if (creep.memory.activity == "claimer")
                amountClaimer += 1;
        }

        var creepSpawn = 0;

        // TRANSPORTER
        if (amountTransporters < amountMiner)
        {
            var bodyparts = [CARRY, MOVE];
            var bodypartsCount = 20;
            var memory = { activity: 'transporter' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, energy, memory);

            if(!(creepSpawn < 0))
                console.log("Spawning transporter:", creepSpawn);
        }

        // MINER
        if (!creepSpawn 
            && amountMiner < amountSources)
        {
            var bodyparts = [WORK, CARRY, MOVE];
            var bodypartsCount = [6, 2, 4];
            var memory = { activity: 'miner' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, energy, memory);

            if(!(creepSpawn < 0))
                console.log("Spawning miner:", creepSpawn);
        }

        // UPGRADER
        if (!creepSpawn 
            && amountUpgraders < 2)
        {
            var bodyparts = [WORK, CARRY, MOVE];
            var bodypartsCount = [10, 10, 4];
            var memory = { activity: 'upgrader' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, amoutOfMaxEnergyInRoom, memory);

            if(!(creepSpawn < 0))
                console.log("Spawning upgrader:", creepSpawn);
        }
        
        // BUILDER
        if (!creepSpawn 
            && amountBuilders < 2)
        {
            var bodyparts = [WORK, CARRY, MOVE];
            var bodypartsCount = -1;
            var memory = { activity: 'builder' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, amoutOfMaxEnergyInRoom, memory);
 
            if(!(creepSpawn < 0))
                console.log("Spawning builder:", creepSpawn);
        }

        // WARRIOR
        if (!creepSpawn 
            && amountWarriors < needSquads * 2)
        {
            //var bodyparts = [ATTACK, MOVE];
            var bodyparts = [MOVE, RANGED_ATTACK];
            var bodypartsCount = -1;
            var memory = { activity: 'warrior' };

            creepSpawn = this.spawningCreepSorted(spawn, bodyparts, bodypartsCount, amoutOfMaxEnergyInRoom, memory);
            console.log(creepSpawn);

            if(!(creepSpawn < 0))
                console.log("Spawning warroir:", creepSpawn);
        }

        // HEALER
        if (!creepSpawn 
            && amountHealers < needSquads)
        {
            var bodyparts = [HEAL, MOVE];
            var bodypartsCount = -1;
            var memory = { activity: 'healer' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, amoutOfMaxEnergyInRoom, memory);
            if(!(creepSpawn < 0))
                console.log("Spawning healer:", creepSpawn);
        }

        // SCOUT
        if (!creepSpawn 
            && amountScout < needScouts)
        {
            var bodyparts = [MOVE];
            var bodypartsCount = 4;
            var memory = { activity: 'scout' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, energy, memory);
 
            if(!(creepSpawn < 0))
                console.log("Spawning scout:", creepSpawn);
        }

        // CLAIMER
        if (!creepSpawn 
            && amountClaimer < needClaimers)
        {
            var bodyparts = [CLAIM, MOVE];
            var bodypartsCount = [2, 1];
            var memory = { activity: 'claimer' };

            creepSpawn = this.spawningCreep(spawn, bodyparts, bodypartsCount, amoutOfMaxEnergyInRoom, memory);
 
            if(!(creepSpawn < 0))
                console.log("Spawning calimer:", creepSpawn);
        }
    }
}

Spawn.getAmountOfAllEnergy = function (spawn)
{
    var energyAmount = spawn.energy;
    var extensions = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_EXTENSION
    });

    for(var index in extensions)
    {
        var extension = extensions[index];

        if(extension.energy > 0)
            energyAmount += extension.energy;
    }

    return energyAmount;
}

Spawn.spawningCreep = function (spawn, bodyparts, bodypartsCount, energy, memory)
{
    if(!spawn.spawning)
    {
        var creepBodyparts = [ ];

        var quit = false;
        var step = 0;
        while (!quit)
        {
            quit = true;

            for (var index in bodyparts)
            {
                if (bodypartsCount == -1 || bodypartsCount > 0 || bodypartsCount[index] > 0 || bodypartsCount[index] == -1)
                {
                    var bodypart = bodyparts[index];

                    if (step == 0 || energy >= BPCost[bodypart])
                    {
                        creepBodyparts.push(bodypart);
                        energy -= BPCost[bodypart];

                        if (bodypartsCount > 0)
                            bodypartsCount -= 1;

                        if (bodypartsCount[index] > 0)
                            bodypartsCount[index] -= 1;

                        quit = false;

                        if (creepBodyparts.length == MAXBODYPARTS)
                        {
                            quit = true;
                            break;
                        }
                    }
                }
            }

            step++;
        }
    }

    //console.log(creepBodyparts);

    return spawn.createCreep(creepBodyparts, undefined, memory);
}

Spawn.spawningCreepSorted = function (spawn, bodyparts, bodypartsCount, energy, memory)
{
    var creepBodyparts = [ ];
    var bodypart = bodyparts[index];

    var split = (100 / bodyparts.length);

    for (var index in bodyparts)
    {
        var count = 0;
        var bodypart = bodyparts[index];

        if (bodypartsCount > 0)
            count = bodypartsCount;
        else if (bodypartsCount[index] > 0)
            count = bodypartsCount[index];
        else
            count = ((energy / BPCost[bodypart]) / split) * 100;
        // 350 / 50 / 50 * 100
        // 7 / 50 * 100
        // 0.45
        // 4.5
        console.log(count, energy, BPCost[bodypart], split)

        for (var i = 0; i < Math.foor(count); i++) { creepBodyparts.push(bodypart); }
    }

    return spawn.createCreep(creepBodyparts, undefined, memory);
}

//Spawn.spawningCreeps = function (spawn)
//{
//    if (workersAmount < minWorkersAmount)
//    {
//        var creepBodyparts = [ ];

//        var energy = Spawn.getAmountOfAllEnergy(spawn);

//        var quit = false;
//        while (!quit)
//        {
//            if(energy >= BPCost[WORK]) 
//            {

//            }
//        }

//        for(var i = 0; i < Math.floor(energy / (100 / 60) / 100); i++) { creepBodyparts.push(WORK); }
//        for(var i = 0; i < Math.floor(energy / (100 / 25) / 50); i++) { creepBodyparts.push(MOVE); }
//        for(var i = 0; i < Math.floor(energy / (100 / 15) / 50); i++) { creepBodyparts.push(CARRY); }

//        console.log(this, energy, workerBodyparts);

//        var name = this.createCreep(workerBodyparts, undefined,
//			{ type: 'worker' })

//        if (!(name < 0))
//        {
//            console.log("Created worker:" + name);
//        }
//    }

//    if (warriorsAmount < minWarriorsAmount && workersAmount >= minWorkersAmount) {
//        var warriorBodyparts = [ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH];

//        var energy = this.getAmountOfAllEnergy();
        
//        for(var i = 0; i < Math.floor(energy / (100 / 50) / 80); i++) { warriorBodyparts.push(ATTACK); }
//        for(var i = 0; i < Math.floor(energy / (100 / 40) / 50); i++) { warriorBodyparts.push(MOVE); }
//        for(var i = 0; i < Math.floor(energy / (100 / 10) / 10); i++) { warriorBodyparts.push(TOUGH); }

//        //console.log(this, energy, warriorBodyparts);

//        var name = this.createCreep(warriorBodyparts, undefined,
//			{ type: 'warrior', activity: 'idle' })

//        if (!(name < 0)) {
//            console.log("Created warrior:" + name);
//        }
//    }
//}

module.exports = Spawn;