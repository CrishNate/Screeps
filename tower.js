// Tower.js

var Tower = {
    tick: function (tower) 
    { }
}

Tower.tick = function (tower) 
{
    var targetObj = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (i) =>  !i.owner || (i.owner && !Memory.whitelist[i.owner.username])
    });

    if (!targetObj)
    {
        var targetObjs = tower.room.find(FIND_STRUCTURES, {
            filter: (i) => (i.structureType != STRUCTURE_WALL && i.structureType != STRUCTURE_RAMPART) && i.hits < i.hitsMax
            || (i.structureType == STRUCTURE_WALL && i.hits < 20000)
            || (i.structureType == STRUCTURE_RAMPART && i.hits < 25000 && i.my)
        });

        var prevHits = -1;

        for (var index in targetObjs)
        {
            var trgObj = targetObjs[index];

            if (prevHits == -1 || prevHits > trgObj.hits)
            {
                prevHits = trgObj.hits;
                targetObj = trgObj;
            }
        }
    }

    if (targetObj)
    {
        if (targetObj.structureType)
            tower.repair(targetObj);
        else if (targetObj.my)
            tower.heal(targetObj);
        else
            tower.attack(targetObj);

    }

};

module.exports = Tower;
