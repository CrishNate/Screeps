var Miner = {
    tick: function (creep, activity, targetID) 
    {
        if (activity == 'mining') 
        {
            // Initialize target
            if (!Game.getObjectById(targetID) 
                || (Game.getObjectById(targetID) && creep.harvest(targetID) == ERR_INVALID_TARGET)) 
            {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);

                if (source)
                {
                    creep.memory.targetID = source.id;
                    targetID = source.id;
                }
            }

            var source = Game.getObjectById(targetID);
		
            if (creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source);
            }

            if (creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.activity = '';
            }
        }
    }
};

module.exports = Miner;