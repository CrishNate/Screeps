/*
 * Finding
 */
var SourceInfo = require('source');

var Finding = {
    findClosestObjectTo: function (object, objects)
    { },

    findClosestSourceTo: function (object)
    { },

    findAvailableSource: function ()
    { },
}

module.exports = Finding;

Finding.findClosestObjectTo = function (object, objects)
{
    var distance = -1;
    var objReturn = undefined;

    for (var index in objects)
    {
        var obj = objects[index];

        if (distance == -1 || distance > obj.pos.getRangeTo(object))
        {
            distance = obj.pos.getRangeTo(object);
            objReturn = obj;
        }
    }

    return obj;
}

Finding.findClosestSourceTo = function (object) {
    var distance = -1;
    var objReturn = undefined;

    for (var index in Memory.sources) {
        var obj = Memory.sources[index];
        var source = Game.getObjectById(obj.id);

        var sourcePos = new RoomPosition(obj.pos.x, obj.pos.y, obj.pos.room);

        console.log(object.pos.getRangeTo(sourcePos));
        if ((distance == -1 || distance > object.pos.getRangeTo(sourcePos))
            && source
            && source.energy > 0
            && SourceInfo.usingAmount(source) < 2
            && SourceInfo.usingAmount(source) !== -1)
        {
            console.log(object.pos.getRangeTo(Game.getObjectById(obj.id)));
            distance = object.pos.getRangeTo(sourcePos);
            objReturn = obj;
        }
    }

    if (objReturn)
    {
        console.log(objReturn, objReturn.id, source, new RoomPosition(objReturn.pos.x, objReturn.pos.y, objReturn.pos.room));
    }

    return objReturn;
}

Finding.findAvailableSource = function()
{
    for (var index in Memory.sources)
    {
        var obj = Memory.sources[index];
        var source = Game.getObjectById(obj.id);

        if( source
            && source.energy > 0
            && SourceInfo.usingAmount(obj) < 2
            && SourceInfo.usingAmount(obj) !== -1)
        {
            return obj;
        }
    }
}