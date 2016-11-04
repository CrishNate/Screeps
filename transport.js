// Transporter.js

var Transporter = {
	
    tick: function (creep, activity, targetID) 
    {
        // getting sources
        if (activity == 'transporting')
        {
            // transporting sources
            var construction = Game.getObjectById(targetID);

            if (!construction || (construction && creep.transfer(construction, RESOURCE_ENERGY) == ERR_INVALID_TARGET))
            {
                var construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_EXTENSION 
                            || structure.structureType == STRUCTURE_SPAWN 
                            || structure.structureType == STRUCTURE_TOWER) 
                            && structure.energy < structure.energyCapacity; 
                    }
                });
                                
                if (construct)
                {
                    creep.memory.targetID = construct.id;
                    targetID = construct.id;
                }
            }

            construction = Game.getObjectById(targetID);
            if (construction && creep.transfer(construction, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(construction);
            }
        }
    }
};

module.exports = Transporter;
