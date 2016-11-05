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

Spawn.prototype.createRoads = function () {
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
        var name = this.createCreep([WORK, MOVE, MOVE, CARRY, CARRY], undefined,
			{ type: 'worker', activity: '' })

        if (!(name < 0))
        {
            console.log("Created worker:" + name);
        }
    }

    if (warriorsAmount < minWarriorsAmount) {
        var name = this.createCreep([ATTACK, ATTACK, ATTACK, MOVE, MOVE], undefined,
			{ type: 'warrior', activity: 'idle' })

        if (!(name < 0)) {
            console.log("Created warrior:" + name);
        }
    }
}

module.exports = {};