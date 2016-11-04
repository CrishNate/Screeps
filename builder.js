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
                    creep.moveTo(construction);
                }
            }
        }
    }
};

module.exports = Builder;