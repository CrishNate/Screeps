// Moving.js
var Moving = {
    moveToOptimized: function (creep, target)
    {

    }
};

module.exports = Moving;

Moving.moveToOptimized = function (creep, movePoint) {
    if (creep && creep.memory._move
        && creep.memory._move.dest.x == movePoint.pos.x
        && creep.memory._move.dest.y == movePoint.pos.y
        && creep.memory._move.dest.room == movePoint.room.name
        && creep.memory._move.path !== undefined
        && ((creep.moveByPath(creep.memory._move.path) == OK
        || creep.moveByPath(creep.memory._move.path) == ERR_TIRED)
        || creep.pos.getRangeTo(movePoint) < 2))
    { }
    else
    {
        //console.log(creep.moveByPath(creep.memory._move.path));
        //console.log(creep.pos.getRangeTo(movePoint))
        creep.moveTo(movePoint);
    }
}

Moving.moveToOptimizedXY = function (creep, x, y, room) {
    if (creep && creep.memory._move
        && creep.memory._move.dest.x == x
        && creep.memory._move.dest.y == y
        && creep.memory._move.dest.room == room
        && creep.memory._move.path !== undefined
        && ((creep.moveByPath(creep.memory._move.path) == OK
        || creep.moveByPath(creep.memory._move.path) == ERR_TIRED)
        || creep.pos.getRangeTo(new RoomPosition(x, y, room)) < 2))
    {
        creep.moveByPath(creep.memory._move.path);
    }
    else
    {
        //console.log(creep.pos.getRangeTo(new RoomPosition(x, y, room)))
        //console.log(creep.moveByPath(creep.memory._move.path));
        creep.moveTo(new RoomPosition(x, y, room));
    }
}
