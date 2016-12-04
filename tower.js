// Tower.js

var Tower = {
    tick: function (tower) 
    { }
}

Tower.tick = function (tower) 
{
    var targetObj = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (i) => !Memory.whilelist[i.owner]
    });

    if (targetObj)
    {
        tower.attack(targetObj);
    }

    var buildingObj = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (i) => (i.structureType != STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART) && i.hits < i.hitsMax
        || (i.structureType == STRUCTURE_WALL && i.hits < 10000)
        || (i.structureType == STRUCTURE_RAMPART && i.hits < 25000 && i.my)
    });

    if (buildingObj)
    {
        tower.repair(buildingObj);
    }

};

module.exports = Tower;
