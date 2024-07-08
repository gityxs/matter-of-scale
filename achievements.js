function ach_enabled_observable(ach, obs) {

}

function AchDefault() {
	this.type = "none";
	this.condition = null;
	this.attr = null;
}
AchDefault.prototype.constructor = AchDefault;
AchDefault.prototype.init = function () {};
AchDefault.prototype.describe = function() { return "No description here."; };
AchDefault.prototype.inject = function() { };

function AchActive(count, act_type, disp, attr) {
	this.type = "active";
	this.count = count;
	this.act_type = act_type;
	this.disp = disp;
	this.attr = attr;
}
AchActive.prototype = Object.create(AchDefault.prototype);
AchActive.prototype.constructor = AchActive;
AchActive.prototype.init = function () {
	var act_type = this.act_type;  var count = this.count;
	this.condition = ko.computed(function() {
		return game.stats.actives[act_type]() >= count;
	});

	if(this.attr) {
		var attr = this.attr;
		this.condition.subscribe(function(value) {
			if(value) {
				game.attr_inject(attr);
			}
		});
	}
};
AchActive.prototype.describe = function() {
	return "Click " + this.count + " " + this.disp + " events";
};

function AchActiveLevel(level, count, act_type, disp, attr) {
	this.type = "active";
	this.level = level;
	this.count = count;
	this.act_type = act_type;
	this.disp = disp;
	this.attr = attr;
}
AchActiveLevel.prototype = Object.create(AchDefault.prototype);
AchActiveLevel.prototype.constructor = AchActiveLevel;
AchActiveLevel.prototype.init = function () {
	var level = this.level; var act_type = this.act_type;  var count = this.count; var attr = this.attr;
	this.condition = ko.computed(function() {
		return game.stats.levels[level].actives[act_type]() >= count;
	});

	if(this.attr) {
		var attr = this.attr;
		this.condition.subscribe(function(value) {
			if(value) {
				game.levels[level].attr_inject(attr);
			}
		});
	}
};
AchActiveLevel.prototype.describe = function() {
	return "Click " + this.count + " " + this.disp + " events for " + leveldata[this.level].name.capitalize()+ "s";
};

function AchIncomeLevel(level, income, attr) {
	this.type = "income";
	this.level = level;
	this.income = income;
	this.attr = attr;
}
AchIncomeLevel.prototype = Object.create(AchDefault.prototype);
AchIncomeLevel.prototype.constructor = AchIncomeLevel;
AchIncomeLevel.prototype.init = function () {
	var level = this.level; var income = this.income;
	this.condition = ko.computed(function () {
		return game.stats.levels[level].max_income() >= income;
	});

	if(this.attr) {
		var attr = this.attr;
		this.condition.subscribe(function(value) {
			if(value) {
				game.levels[level].attr_inject(attr);
			}
		});
	}
};
AchIncomeLevel.prototype.describe = function() {
	return "Have a "+leveldata[this.level].name.capitalize()+" with at least "+this.income+ " income";
};

function AchBuildingCount(level, bid, count, attr) {
	this.level = level;
	this.bid = bid;
	this.count = count;
	this.attr = attr;
}
AchBuildingCount.prototype = Object.create(AchDefault.prototype);
AchBuildingCount.prototype.constructor = AchBuildingCount;
AchBuildingCount.prototype.init = function () {
	var self = this;
	this.condition = ko.computed(function () {
		return game.stats.levels[self.level].buildings[self.bid].count() >= self.count;
	});

	if(this.attr) {
		var attr = this.attr;
		this.condition.subscribe(function(value) {
			if(value) {
				game.levels[level].attr_inject(attr);
			}
		});
	}
};
AchBuildingCount.prototype.describe = function() {
	return "Build "+this.count+" "+leveldata[this.level].buildings[this.bid].name.capitalize()+"s";
};

var achievements = [];
function achievements_create() {
	for(var i=0; i<leveldata.length; i++) {
		for(var j=0; j<5; j++) {
			achievements.push(new AchIncomeLevel(i, 50 * Math.pow(10, j), null));
		}
	}
	for(var i=0; i<5; i++) {
		var attr = null;
		if(i % 2 == 0) {
			attr = new Attr("time_curr_dur", [new ComponentVal("val", 25)]);
		} else {
			attr = new Attr("time_curr_rate", [new ComponentVal("val", 25)]);
		}
		achievements.push(new AchActive(50 * Math.pow(10, i), "time_curr", "Vote", attr));
	}
	for(var i=0; i<leveldata.length; i++) {
		for(var j=0; j<5; j++) {
			var attr = null;
			if(j % 2 == 0) {
				attr = new Attr("prestige_dur", [new ComponentVal("val", 25)]);
			} else {
				attr = new Attr("prestige_rate", [new ComponentVal("val", 25)]);
			}
			achievements.push(new AchActiveLevel(i, 5 * Math.pow(10, j), "researchpt", "Research", attr));
		}
	}
	for(var i=0; i<leveldata.length; i++) {
		for(var j=0; j<5; j++) {
			var attr = null;
			if(j % 2 == 0) {
				attr = new Attr("upgrade_dur", [new ComponentVal("val", 25)]);
			} else {
				attr = new Attr("upgrade_rate", [new ComponentVal("val", 25)]);
			}
			achievements.push(new AchActiveLevel(i, 5 * Math.pow(10, j), "upgradept", "Upgrade", attr));
		}
	}
	for(var i=0; i<leveldata.length; i++) {
		for(var j=5; j<leveldata[i].buildings.length; j++) {
			for(var k=0; k<5; k++) {
				achievements.push(new AchBuildingCount(i, j, 100 * Math.pow(2, k)));
			}
		}
	}
}

function achievements_init() {
	for(var i=0; i<achievements.length; i++) {
		achievements[i].init();
	}
}