// Warrior.js
var Moving = require('moving');
var Finding = require('finding');
var SourceInfo = require('source');

var Scout = {

    tick: function (creep, activity, targetID) {

        // getting sources
        if (activity == 'scouting') {
            // transporting sources

            var sources = creep.room.find(FIND_SOURCES);
            for (var index in sources)
            {
                var sourceEl = sources[index];
                SourceInfo.add(sourceEl, creep.room);
            }

            var point = creep.memory.point;

            var targetScout = undefined;

            var availablePoints = []
            for (var index in Game.flags) {
                var flag = Game.flags[index];

                if (flag.memory.scout) {
                    availablePoints.push(flag);
                }
            }

            targetScout = Finding.findClosestObjectTo(creep, availablePoints);

            if (!targetScout)
            {
                creep.memory.activity = '';
            }
            //if (!point || (targetDefence
            //    && point.pos.x != targetDefence.pos.x
            //    && point.pos.y != targetDefence.pos.y
            //    && point.room != targetDefence.room))
            //{
            //    creep.say("defence");
            //    point = targetDefence;
            //    creep.memory.point = targetDefence;
            //}

            if (targetScout && !creep.pos.isNearTo(targetScout))
            {
                Moving.moveToOptimized(creep, targetScout);
            }
        }
    }
};

module.exports = Scout;
