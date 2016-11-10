var Moving = require('moving');
var SourceInfo = require('source');

var Miner = {
    tick: function (creep, activity, targetID) 
    {
        if (activity == 'mining') 
        {
            // Initialize target
            var targetObj = Game.getObjectById(targetID);

            //console.log(Game.resources[targetObj.id], Game.creeps[targetObj.id]);

            if (!targetObj || creep.harvest(targetObj) != ERR_BUSY && (!targetObj.pos.lookFor(LOOK_SOURCES) && !targetObj.pos.lookFor(LOOK_CREEPS)))
            {
                var sources = creep.room.find(FIND_SOURCES);
                for (var index in sources)
                {
                    var source = sources[index];
                    SourceInfo.add(source, creep.room);
                }

                for (var index in Game.flags)
                {
                    var flag = Game.flags[index];
                    var source = creep.pos.findInRange(FIND_SOURCES, 1);

                    if(source) { sources.push(source); }
                }

                var source = creep.pos.findClosestByRange(sources, {
	                filter: (source) => { 
	                    return source.energy > 0 && (SourceInfo.usingAmount(source) < 2 && SourceInfo.usingAmount(source) !== -1);
	                }
                });

                if (source)
                {
                    creep.memory.targetID = source.id;
                    targetID = source.id;
                    SourceInfo.addUser(source, creep);
                    //console.log(creep.name, "set");
                }
                else
                {
                    var creepTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
	                    filter: (filterObj) => { 
	                        return filterObj.carry.energy > 50 && (filterObj.memory.activity == "mining" || filterObj.memory.activity == "transporting");
	                    }
                    });
                    
                    //console.log(creepTarget, creep.name);
                    if (creepTarget)
                    {
                        creep.memory.targetID = creepTarget.id;
                        targetID = creepTarget.id;
                        //console.log(creep.name, '0', creepTarget);
                    }
                    else
                    {
                        creep.memory.activity = '';
                        //console.log(creep.name, '1');
                    }
                }
            }

            targetObj = Game.getObjectById(targetID);

            //if (targetObj){ console.log(creep.name, targetObj, targetObj.pos.lookFor(LOOK_CREEPS).length); } else { console.log(targetObj + "_" + targetID); }
            if (targetObj && !targetObj.pos.lookFor(LOOK_CREEPS).length)
            {
                if (creep.harvest(targetObj) == ERR_INVALID_TARGET)
                {
                    SourceInfo.removeUser(targetObj, creep);
                    creep.memory.targetID = '';
                    //console.log(creep.name, 'rem_2');
                }

                if (creep.harvest(targetObj) == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, targetObj);
                }

                if (creep.carry.energy == creep.carryCapacity)
                {
                    SourceInfo.removeUser(targetObj, creep);
                    creep.memory.activity = '';
                    //console.log(creep.name, 'rem_3');
                }
                else if (targetObj && targetObj.energy == 0)
                {
                    SourceInfo.removeUser(targetObj, creep);
                    creep.memory.targetID = '';
                    //console.log(creep.name, 'rem_4');
                }
            }
            else if(targetObj && targetObj.pos.lookFor(LOOK_CREEPS).length)
            {
                var transerResult = targetObj.transfer(creep, RESOURCE_ENERGY, targetObj.carry.energy / 2);

                if (transerResult == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, targetObj);
                }
                else if(transerResult == OK || targetObj.carry < 50)
                {
                    creep.memory.activity = '';
                    creep.memory.targetID = '';
                    //console.log(creep.name, '6');
                }
            }
            else
            {
                creep.memory.activity = '';
                creep.memory.targetID = '';
                //console.log(creep.name, "none");
            }
        }
    }
};

module.exports = Miner;