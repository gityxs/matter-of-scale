function ActDefault(time) {
	this.type = "default";
	this.time = time;
}
ActDefault.prototype.constructor = ActDefault;
ActDefault.prototype.click = function() { };
ActDefault.prototype.icon = function() { return this.icon_img; };
ActDefault.prototype.allowed = function() { return true; }

function ActTimeCurrency(time) {
	ActDefault.call(this, time);
	
	this.type = "time_curr";
  this.icon_img = "img/time_currency.png";
}
ActTimeCurrency.prototype = Object.create(ActDefault.prototype);
ActTimeCurrency.prototype.constructor = ActTimeCurrency;
ActTimeCurrency.prototype.click = function(active) {
  game.time_currency(game.time_currency() + 1);
	game.stats.actives[this.type](game.stats.actives[this.type]() + 1);
};

function ActUpgradePoint(time, level) {
  ActDefault.call(this, time);

  this.type = "upgradept";
	this.level = level;
  this.icon_img = "img/upgrade_icon.png";
}
ActUpgradePoint.prototype = Object.create(ActDefault.prototype);
ActUpgradePoint.prototype.constructor = ActUpgradePoint;
ActUpgradePoint.prototype.click = function() {
	var level = game.levels[this.level];
	level.upgradepts(level.upgradepts() + 1);

	var statlevel = game.stats.levels[this.level];
	statlevel.actives[this.type](statlevel.actives[this.type]() + 1);
};
ActUpgradePoint.prototype.allowed = function() {
	return game.max_level() >= this.level;
};

function ActResearchPoint(time, level) {
  ActDefault.call(this, time);

  this.type = "researchpt";
	this.level = level;
}
ActResearchPoint.prototype = Object.create(ActDefault.prototype);
ActResearchPoint.prototype.constructor = ActTimeCurrency;
ActResearchPoint.prototype.click = function() {
  game.levels[this.level].currency(game.levels[this.level].currency() + 1);
	game.stats.levels[this.level].actives[this.type](game.stats.levels[this.level].actives[this.type]() + 1);
};
ActResearchPoint.prototype.icon = function() {
  return prestige_png(this.level);
};
ActResearchPoint.prototype.allowed = function() {
	return game.max_level() >= this.level;
};

var cur_act_id = 0;
function active_create(act) {
	var duration = 7;

	var mult = 100;
	switch(act.type) {
		case "time_curr":
			mult += game.attrs.time_curr_dur(); break;
		case "upgradept":
			mult += game.levels[act.level].attrs.upgrade_dur(); break;
		case "researchpt":
			mult += game.levels[act.level].attrs.prestige_dur(); break;
	}
	mult /= 100;

	duration *= mult;

	duration += 2; // Fade-in time

	var active = {
		id: cur_act_id++,
		base: act,
		dur: duration,
		remaining: ko.observable(duration)
	};

	return active;
}

function active_time_start() {
	return performance.now() + 2 * 60 * 1000 + Math.random() * 6 * 60 * 1000;
}

function updateactives(elapsed) {
	for(var i=game.actives().length - 1; i>=0; i--) {
		var active = game.actives()[i];
		
		active.remaining(active.remaining() - elapsed);
		
		if(active.remaining() <= 0 || active.clicked) {
			if(!active.clicked) ga('send', 'event', 'actives', 'expire', active.base.type);
			game.actives.remove(active);
		}
	}
	
	for(var i=0; i<game.nextactive.length; i++) {
		if(performance.now() >= game.nextactive[i].time) {
			var rate = 100;
			switch(game.nextactive[i].type) {
				case "time_curr":
					rate += game.attrs.time_curr_rate(); break;
				case "upgradept":
					rate += game.levels[game.nextactive[i].level].attrs.upgrade_rate(); break;
				case "researchpt":
					rate += game.levels[game.nextactive[i].level].attrs.prestige_rate(); break;
			}
			rate /= 100;
			var time_between = 4 * 60 / rate;
			var time_between_var = 2 * 60 / rate;

			game.nextactive[i].time = performance.now() + (time_between_var * Math.random() + time_between) * 1000;

			if(!game.nextactive[i].allowed()) continue;
			
			var active = active_create(game.nextactive[i]);
			game.actives.push(active);
		}
	}
}