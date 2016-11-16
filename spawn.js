/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

var minWorkersAmount = 12;
var minWarriorsAmount = 3;
var minClaimerAmount = 1;

Spawn.prototype.createConstructionSites = function (path, constuction) {
    for (var index in path) {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        if (this.room.lookForAt('structure', roomPosition).length == 0 && this.room.lookForAt('constructionSite', roomPosition).length == 0) {
            this.room.createConstructionSite(roomPosition, constuction);
        }
    }
}

Spawn.prototype.createRoads = function () 
{
    var sources = this.room.find(FIND_SOURCES);

    for (var index in sources)
    {
        var source = sources[index];
        var source = this.pos.findClosestByPath(FIND_SOURCES);
        var path = this.room.findPath(source.pos, this.pos, { ignoreRoads: true, ignoreCreeps: true })
        this.createConstructionSites(path, STRUCTURE_ROAD)

        path = this.room.findPath(source.pos, this.room.controller.pos, { ignoreRoads: true, ignoreCreeps: true })
        this.createConstructionSites(path, STRUCTURE_ROAD)

        path = this.room.findPath(this.pos, this.room.controller.pos, { ignoreRoads: true, ignoreCreeps: true })
        this.createConstructionSites(path, STRUCTURE_ROAD)
    }
}

Spawn.prototype.createRoadTo = function (object) 
{
    console.log(object);
    var path = this.room.findPath(object.pos, this.pos, { ignoreRoads: true, ignoreCreeps: true })
    console.log(path);
    this.createConstructionSites(path, STRUCTURE_ROAD)
}

Spawn.prototype.getAmountOfAllEnergy = function ()
{
    var energyAmount = 0;
    var extensions = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION) }
    });

    for(var index in extensions)
    {
        var extension = extensions[index];
        if(extension.energy > 0) { energyAmount += extension.energy; }
    }

    return energyAmount;
}


Spawn.prototype.createCreeps = function ()
{
    var workersAmount = 0;
    var warriorsAmount = 0;
    for (var index in Game.creeps)
    {
        var creep = Game.creeps[index];
        var type = creep.memory.type;

        if (type == 'worker')
        {
            workersAmount += 1;
        };

        if (type == 'warrior')
        {
            warriorsAmount += 1;
        };
    }

    if (workersAmount < minWorkersAmount)
    {
        var workerBodyparts = [WORK, MOVE, MOVE, CARRY, CARRY]

        var energy = this.getAmountOfAllEnergy();

        for(var i = 0; i < Math.floor(energy / (100 / 60) / 100); i++) { workerBodyparts.push(WORK); }
        for(var i = 0; i < Math.floor(energy / (100 / 25) / 50); i++) { workerBodyparts.push(MOVE); }
        for(var i = 0; i < Math.floor(energy / (100 / 15) / 50); i++) { workerBodyparts.push(CARRY); }

        console.log(this, energy, workerBodyparts);

        var name = this.createCreep(workerBodyparts, undefined,
			{ type: 'worker' })

        if (!(name < 0))
        {
            console.log("Created worker:" + name);
        }
    }

    if (warriorsAmount < minWarriorsAmount && workersAmount >= minWorkersAmount) {
        var warriorBodyparts = [ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH];

        var energy = this.getAmountOfAllEnergy();
        
        for(var i = 0; i < Math.floor(energy / (100 / 50) / 80); i++) { warriorBodyparts.push(ATTACK); }
        for(var i = 0; i < Math.floor(energy / (100 / 40) / 50); i++) { warriorBodyparts.push(MOVE); }
        for(var i = 0; i < Math.floor(energy / (100 / 10) / 10); i++) { warriorBodyparts.push(TOUGH); }

        //console.log(this, energy, warriorBodyparts);

        var name = this.createCreep(warriorBodyparts, undefined,
			{ type: 'warrior', activity: 'idle' })

        if (!(name < 0)) {
            console.log("Created warrior:" + name);
        }
    }
}

module.exports = {};