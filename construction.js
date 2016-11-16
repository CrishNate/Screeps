/*
 * Construction
 */

var Construction = {
    createConstructionSitesByPath: function (room, path, constuction) 
    { },
    createConstructionFromTo: function (room, object1, object2, constuction) 
    { },
}

module.exports = Construction;

Construction.createConstructionSitesByPath = function (room, path, constuction) 
{
    for (var index in path) {
        var item = path[index];
        var roomPosition = room.getPositionAt(item.x, item.y);
        if (room.lookForAt('structure', roomPosition).length == 0 && room.lookForAt('constructionSite', roomPosition).length == 0) {
            room.createConstructionSite(roomPosition, constuction);
        }
    }
}

Construction.createConstructionFromTo = function (room, object1, object2, constuction) 
{
    var path = room.findPath(object1.pos, object2.pos, { ignoreRoads: true, ignoreCreeps: true })
    Construction.createConstructionSites(room, path, constuction)
}
