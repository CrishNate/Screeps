/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

var minCreepsAmount = 12;

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
    var amount = 0;
    if (Game.creeps.length !== undefined)
    {
        amount = Game.creeps.length;
    }

    if (amount < minCreepsAmount)
    {
        var name = this.createCreep([WORK, MOVE, MOVE, CARRY, CARRY], undefined,
			{ type: 'worker', activity: '' })

        if (!(name < 0))
        {
            console.log("Created creep:" + name);
        }
    }
}

module.exports = {};