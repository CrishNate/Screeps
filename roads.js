/*
 * Roads
 */

var Roads = {
    addRoad: function (x, y, room)
    { },
    removeRoad: function (x, y, room)
    { },
}

module.exports = Roads;

Roads.addRoad = function (x, y, room)
{
    if (!Memory.roads[x + "_" + y + "_" + room])
    {
        Memory.roads[x + "_" + y + "_" + room] = true;
        return true;
    }
    else
        return false;
};

Roads.removeRoad = function (x, y, room)
{
    if (Memory.roads[x + "_" + y + "_" + room])
    {
        delete Memory.roads[x + "_" + y + "_" + room];
        return true;
    }
    else
        return false;
};
