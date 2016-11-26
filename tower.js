// Tower.js

var Tower = {
    tick: function (tower) 
    { }
}

Tower.tick = function (tower) 
{
    var targetObj = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (targetObj)
    {
        tower.attack(targetObj);
    }
};

module.exports = Tower;
