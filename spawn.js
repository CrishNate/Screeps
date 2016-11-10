/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

var minWorkersAmount = 8;
var minWarriorsAmount = 3;

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

    //for (var index in sources)
    //{
    //var source = sources[index];
    var source = this.pos.findClosestByPath(FIND_SOURCES);
    var path = this.room.findPath(source.pos, this.pos, { ignoreRoads: true, ignoreCreeps: true })
    this.createConstructionSites(path, STRUCTURE_ROAD)

    path = this.room.findPath(source.pos, this.room.controller.pos, { ignoreRoads: true, ignoreCreeps: true })
    this.createConstructionSites(path, STRUCTURE_ROAD)

    path = this.room.findPath(this.pos, this.room.controller.pos, { ignoreRoads: true, ignoreCreeps: true })
    this.createConstructionSites(path, STRUCTURE_ROAD)
    //}
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
    var energy = this.getAmountOfAllEnergy();

    if (workersAmount < minWorkersAmount)
    {
        var workerBodyparts = [WORK, MOVE, MOVE, CARRY, CARRY];

        var energy = this.getAmountOfAllEnergy();
        var energyDivision = energy / 2;
        

        for(var i = 0; i < Math.floor(energyDivision / 100); i++) { workerBodyparts.push(WORK); }
        for(var i = 0; i < Math.floor(energyDivision / 50); i++) { workerBodyparts.push(MOVE); }

        //console.log(this, energy, workerBodyparts);

        var name = this.createCreep(workerBodyparts, undefined,
			{ type: 'worker', activity: '' })

        if (!(name < 0))
        {
            console.log("Created worker:" + name);
        }
    }

    if (warriorsAmount < minWarriorsAmount && workersAmount >= minWorkersAmount) {
        var warriorBodyparts = [ATTACK, ATTACK, MOVE, MOVE];

        var energy = this.getAmountOfAllEnergy();
        var energyDivision = energy / 2;
        
        for(var i = 0; i < Math.floor(energyDivision / 80); i++) { warriorBodyparts.push(ATTACK); }
        for(var i = 0; i < Math.floor(energyDivision / 50); i++) { warriorBodyparts.push(MOVE); }

        //console.log(this, energy, warriorBodyparts);

        var name = this.createCreep(warriorBodyparts, undefined,
			{ type: 'warrior', activity: 'idle' })

        if (!(name < 0)) {
            console.log("Created warrior:" + name);
        }
    }
}

module.exports = {};