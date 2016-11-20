// Moving.js
var Moving = {
    moveToOptimized: function (creep, target)
    { }
};

module.exports = Moving;

Moving.moveToOptimized = function (creep, movePoint) {

    if (creep && creep.memory._move
        && new RoomPosition(creep.memory._move.dest.x, creep.memory._move.dest.y, creep.memory._move.dest.room).isEqualTo(movePoint)
        && creep.memory._move.path !== undefined)
    {
        var pathResult = creep.moveByPath(creep.memory._move.path);
        if ((pathResult == OK
            && (!creep.memory.prevPos || (creep.memory.prevPos
            && !(creep.pos.x == creep.memory.prevPos.x && creep.pos.y == creep.memory.prevPos.y && creep.room.name == creep.memory.prevPos.roomName))))
            || pathResult == ERR_TIRED || creep.pos.isNearTo(movePoint))
        {
            if (pathResult == OK)
            {
                creep.memory.prevPos = creep.pos;
            }

            return pathResult;
        }
        else
        {
            creep.moveTo(movePoint);
        }
    }
    else
    {
        //creep.say(creep.moveByPath(creep.memory._move.path));
        creep.moveTo(movePoint);
    }

    return -1;
}

Moving.moveToOptimizedXY = function (creep, x, y, room) {
    if (creep && creep.memory._move
        && new RoomPosition(creep.memory._move.dest.x, creep.memory._move.dest.y, creep.memory._move.dest.room).isEqualTo(new RoomPosition(x, y, room))
        && creep.memory._move.path !== undefined
        && (creep.moveByPath(creep.memory._move.path) == OK
        || creep.moveByPath(creep.memory._move.path) == ERR_TIRED
        || creep.pos.isNearTo(new RoomPosition(x, y, room))))
    { }
    else
    {
        //creep.say(creep.moveByPath(creep.memory._move.path));
        creep.moveTo(new RoomPosition(x, y, room));
    }
}
