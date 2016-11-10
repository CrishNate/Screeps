var Moving = require('moving');

var Builder = {

    /** @param {Creep} creep **/
    tick: function (creep, activity, targetID)
    {
        if (activity == 'building')
        {
            // Initialize target
            var construction = Game.getObjectById(targetID)
            if (!construction
                || (construction && creep.build(construction) == ERR_INVALID_TARGET))
            {
                var construct = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

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

            // Working with target
            construction = Game.getObjectById(targetID);

            if (construction)
            {
                if (creep.build(construction) == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, construction, creep.room);
                }
            }
            else
            {
                creep.memory.activity = '';
                creep.memory.targetID = '';
            }
        }

        if (activity == 'repairing')
        {
            // Initialize target
            var construction = Game.getObjectById(targetID)
            if (!construction
                || (construction && creep.repair(construction) == ERR_INVALID_TARGET))
            {
                var construct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_EXTENSION 
                            || structure.structureType == STRUCTURE_SPAWN 
                            || structure.structureType == STRUCTURE_ROAD
                            || structure.structureType == STRUCTURE_TOWER
                            || (structure.structureType == STRUCTURE_WALL && structure.hits < 10000)
                            || structure.structureType == STRUCTURE_CONTAINER) 
                            && structure.hits < structure.hitsMax; 
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

            // Working with target
            construction = Game.getObjectById(targetID);

            if (construction)
            {
                if (creep.repair(construction) == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, construction);
                }
                
                if (construction.hits == construction.hitsMax)
                {
                    creep.memory.targetID = '';
                }
            }
            else
            {
                creep.memory.activity = '';
                creep.memory.targetID = '';
            }
        }
    }
};

module.exports = Builder;