// Source.js

if (Memory.sources == undefined)
{
    Memory.sources = { };
}

var SourceInfo = {
    add: function(source, room)
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

SourceInfo.add = function (source, room)
{
    if (!Memory.sources[source.id])
    {
        var sourceInfo = {
            'id': source.id
            , 'pos': { x: source.pos.x, y: source.pos.y, room: room.name }
            , 'using': { }
        };

        console.log(sourceInfo);
        Memory.sources[source.id] = sourceInfo;
    }
    else { return -1; }
};

SourceInfo.usingAmount = function (source)
{
    if (Memory.sources[source.id])
    {
        return Object.keys(Memory.sources[source.id].using).length;
    }
    else { return -1; }
},

SourceInfo.addUser = function (source, creep)
{
    if (Memory.sources[source.id])
    {
        Memory.sources[source.id].using[creep.id] = true;
        return 0;
    }
    else { return -1; }
},

SourceInfo.removeUser = function (source, creep)
{
    if (Memory.sources[source.id])
    {
        delete Memory.sources[source.id].using[creep.id];
        return 0;
    }
    else { return -1; }
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
                var userID = source.using[index2];

                if (userID && !Game.getObjectById(userID))
                {
                    delete Memory.sources[index].using[index2];
                }
            }
        }
    }
}