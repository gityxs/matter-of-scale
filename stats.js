function StatBuilding(level, bid) {
	this.level = level;
	this.bid = bid;

	this.count = ko.observable(-1);
	this.income = ko.observable(-1);
	this.autobuy = ko.observable(-1);
}
StatBuilding.prototype.constructor = StatBuilding;
StatBuilding.prototype.save = function() {
	var saved = {};

	saved.count = this.count();
	saved.income = this.income();  // Not implemented yet
	saved.autobuy = this.autobuy();

	return saved;
};
StatBuilding.prototype.load = function(saved) {
	this.reset();

	if(saved.count >= 0) this.count(saved.count);
	if(saved.income >= 0) this.income(saved.income);
	if(saved.autobuy >= 0) this.autobuy(saved.autobuy);
};
StatBuilding.prototype.reset = function() {
	this.count(0);
	this.income(0);
	this.autobuy(0);
};

function StatLevel(level) {
	this.level = level;

	this.income = ko.observable(-1);
	this.max_income = ko.observable(-1);
	this.completed = ko.observable(-1);

	this.actives = {};
	this.actives.upgradept = ko.observable(-1);
	this.actives.researchpt = ko.observable(-1);

	this.buildings = [];
	for(var i=0; i<leveldata[this.level].buildings.length; i++) {
		this.buildings.push(new StatBuilding(this.level, i));
	}
}
StatLevel.prototype.constructor = StatLevel;
StatLevel.prototype.save = function() {
	var saved = {};

	saved.income = this.income();
	saved.max_income = this.max_income();
	saved.completed = this.completed();

	saved.actives = {};
	saved.actives.upgradept = this.actives.upgradept();
	saved.actives.researchpt = this.actives.researchpt();

	saved.buildings = [];
	for(var i=0; i<this.buildings.length; i++) {
		saved.buildings.push(this.buildings[i].save());
	}

	return saved;
};
StatLevel.prototype.load = function(saved) {
	this.reset();

	if(saved.income >= 0)
		this.income(saved.income);
	else
		this.income(0);

	if(saved.max_income >= 0)
		this.max_income(saved.max_income);
	else
		this.max_income(0);

	if(saved.completed >= 0)
		this.completed(saved.completed);
	else
		this.completed(0);

	if(saved.actives.upgradept >= 0)
		this.actives.upgradept(saved.actives.upgradept);
	else
		this.actives.upgradept(0);

	if(saved.actives.researchpt >= 0)
		this.actives.researchpt(saved.actives.researchpt);
	else
		this.actives.researchpt(0);

	if(_.isArray(saved.buildings)) {
		for(var i=0; i<saved.buildings.length && i<this.buildings.length; i++) {
			this.buildings[i].load(saved.buildings[i]);
		}
	}
};
StatLevel.prototype.reset = function() {
	this.income(0);
	this.max_income(0);
	this.completed(0);
	this.actives.upgradept(0);
	this.actives.researchpt(0);

	for(var i=0; i<leveldata[this.level].buildings.length; i++) {
		this.buildings[i].reset();
	}
};

function Stats() {
	this.total = ko.observable(-1);
	this.found_time = ko.observable(-1);
	this.play_time = ko.observable(-1);
	this.idle_time = ko.observable(-1);
	this.last_save = ko.observable(-1);
	this.actives = {};

	this.actives.time_curr = ko.observable(-1);

	this.levels = [];
	for(var i=0; i<leveldata.length; i++) {
		this.levels[i] = new StatLevel(i);
	}
}
Stats.prototype.constructor = Stats;
Stats.prototype.load = function(saved) {
	this.reset();

	if(saved.total >= 0)
		this.total(saved.total);

	if(saved.last_save >= 1000000)
		this.last_save(saved.last_save);

	if(saved.actives) {
		if(saved.actives.time_curr >= 0)
			this.actives.time_curr(saved.actives.time_curr);
		else
			this.actives.time_curr(0);
	}

	for(var i=0; i<this.levels.length; i++) {
		this.levels[i].load(saved.levels[i]);
	}
};
Stats.prototype.save = function() {
	var saved = {};

	saved.total = this.total();

	saved.actives = {};
	saved.actives.time_curr = this.actives.time_curr();

	this.last_save(Date.now());
	saved.last_save = this.last_save();

	saved.levels = [];
	for(var i=0; i<this.levels.length; i++) {
		saved.levels[i] = this.levels[i].save();
	}

	return saved;
};
Stats.prototype.reset = function() {
	this.total(0);

	this.actives.time_curr(0);
	this.last_save(Date.now());

	for(var i=0; i<this.levels.length; i++) {
		this.levels[i].reset();
	}
};
Stats.prototype.tick = function(elapsed) {
	this.play_time(this.play_time() + elapsed);
};
