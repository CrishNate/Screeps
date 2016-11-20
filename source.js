// Source.js

if (Memory.sources == undefined)
{
    Memory.sources = { };
}

var SourceInfo = {
    add: function(source)
    { },

    usingAmount: function(source, room)
    { },

    addUser: function(source)
    { },

    removeUser: function(source)
    { },

    updateUsers: function (source)
    { },
};

module.exports = SourceInfo;

SourceInfo.add = function (source)
{
    if (!Memory.sources[source.id])
    {
        var sourceInfo = {
            'id': source.id
            , 'pos': { x: source.pos.x, y: source.pos.y, room: source.room.name }
            , 'using': {}
            , 'source': source
        };

        console.log(sourceInfo);
        Memory.sources[source.id] = sourceInfo;
    }
    else
        return -1;
};

SourceInfo.usingAmount = function (source)
{
    if (Memory.sources[source.id])
    {
        return Object.keys(Memory.sources[source.id].using).length;
    }
    else
        return -1;
},

SourceInfo.addUser = function (source, creep)
{
    if (Memory.sources[source.id])
    {
        Memory.sources[source.id].using[creep.id] = true;
        return 0;
    }
    else
        return -1;
},

SourceInfo.removeUser = function (source, creep)
{
    if (Memory.sources[source.id])
    {
        Memory.sources[source.id].using[creep.id] = undefined;
        return 0;
    }
    else
        return -1;
}

SourceInfo.updateUsers = function ()
{
    for (var index in Memory.sources)
    {
        var source = Memory.sources[index];

        if (source)
        {
            for (var index2 in source.using)
            {
                if (!Game.getObjectById(index2))
                {
                    //console.log("removed", index, index2)
                    Memory.sources[index].using[index2] = undefined;
                }
            }
        }
    }
}