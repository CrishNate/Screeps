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
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_CONTAINER) 
                            && structure.hits < structure.hitsMax; 
                    }
                });

                if (construct)
                {
                    creep.memory.targetID = construct.id;
                    targetID = construct.id;
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
                else if (construction.hits == construction.hitsMax)
                {
                    creep.memory.activity = '';
                }
            }
        }
    }
};

module.exports = Builder;