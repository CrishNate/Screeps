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

Finding.findClosestObjectTo = function (object, objects, params)
{
    var distance = -1;
    var objReturn = null;

    for (var index in objects)
    {
        var obj = objects[index];

        if ((!params || params(obj))
            && (distance == -1 || distance > obj.pos.getRangeTo(object)))
        {
            distance = obj.pos.getRangeTo(object);
            objReturn = obj;
        }
    }

    return objReturn;
}

Finding.findClosestSourceTo = function (object)
{
    var objReturn = undefined;

    for (var index in Memory.sources) {
        var obj = Memory.sources[index];

        if (distance == -1 || distance > object.pos.getRangeTo(sourcePos) && SourceInfo.usingAmount(source) < 1)
        {
            console.log(object.pos.getRangeTo(Game.getObjectById(obj.id)));
            distance = object.pos.getRangeTo(sourcePos);
            objReturn = obj;
        }
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