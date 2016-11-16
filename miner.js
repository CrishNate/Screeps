var Moving = require('moving');
var SourceInfo = require('source');
var Finding = require('finding');

var Miner = {
    tick: function (creep, activity, targetID) 
    {
        if (activity == 'mining') 
        {
            // Initialize target
            var targetObj = Game.getObjectById(targetID);

            //console.log(Game.resources[targetObj.id], Game.creeps[targetObj.id]);

            if (!targetObj || creep.harvest(targetObj) != ERR_BUSY && (!targetObj.pos.lookFor(LOOK_SOURCES) && !Game.creeps[targetObj.name]))
            {
                var sources = creep.room.find(FIND_SOURCES);
                for (var index in sources)
                {
                    var sourceEl = sources[index];
                    SourceInfo.add(sourceEl, creep.room);
                }

                //for (var index in Game.flags)
                //{
                //    var flag = Game.flags[index];
                //    var sourceFind = flag.pos.findInRange(FIND_SOURCES, 1);

                //    if(sourceFind) { sources.push(sourceFind); }
                //}
                //console.log(sources);

                var sourceFindResult = creep.pos.findClosestByRange(sources, {
	                filter: (source) => { 
	                    return source.energy > 0 && (SourceInfo.usingAmount(source) < 2 && SourceInfo.usingAmount(source) !== -1);
	                }
                });

                if (sourceFindResult)
                {
                    creep.memory.targetID = sourceFindResult.id;
                    targetID = sourceFindResult.id;
                    SourceInfo.addUser(sourceFindResult, creep);
                    //console.log(creep.name, "set");
                }
                else
                {
                    var creepTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
	                    filter: (filterObj) => { 
	                        return filterObj.carry.energy > filterObj.carryCapacity / 2;
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
            if (targetObj && !Game.creeps[targetObj.name])
            {
                if (creep.harvest(targetObj) == ERR_INVALID_TARGET)
                {
                    SourceInfo.removeUser(targetObj, creep);
                    creep.memory.targetID = '';
                    //console.log(creep.name, 'rem_2');
                }
                
                //creep.say(SourceInfo.usingAmount(targetObj) + "_" + targetObj.pos.x + "_" + targetObj.pos.y);

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
            else if(targetObj && Game.creeps[targetObj.name])
            {
                var transerResult = targetObj.transfer(creep, RESOURCE_ENERGY, targetObj.carry.energy / 2);

                if (transerResult == ERR_NOT_IN_RANGE)
                {
                    Moving.moveToOptimized(creep, targetObj);
                }
                 
                if(transerResult == OK || targetObj.carry.energy < targetObj.carryCapacity / 2)
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