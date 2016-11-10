// Transporter.js
var Moving = require('moving');

var Transporter = {
	
    tick: function (creep, activity, targetID) 
    {
        // getting sources
        if (activity == 'transporting')
        {
            // transporting sources
            var construction = Game.getObjectById(targetID);

            if (!construction || (construction 
                && (creep.transfer(construction, RESOURCE_ENERGY) !== ERR_NOT_IN_RANGE)))
            {
                var construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_EXTENSION 
                            || structure.structureType == STRUCTURE_SPAWN 
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_CONTAINER) 
                            && structure.energy < structure.energyCapacity; 
                    }
                });
                                
                if (construct)
                {
                    creep.memory.targetID = construct.id;
                    targetID = construct.id;
                }
                else
                {
                    creep.memory.activity = '';
                }
            }

            construction = Game.getObjectById(targetID);
            if (construction)
            {
                if (creep.transfer(construction, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, construction, creep.room);
                }
                else if(creep.transfer(construction, RESOURCE_ENERGY) !== OK)
                {
                    creep.memory.targetID = '';
                }
            }
        }
    }
};

module.exports = Transporter;
