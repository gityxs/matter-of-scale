oldgoals = [
	{
		id: 0,
		type: "income",
		val: 5000
	}, {
		id: 1,
		type: "buildall",
		val: 30
	}, {
		id: 2,
		type: "buildone",
		val: 60
	}
];

function Goal() {
	this.type = "unknown";
}
Goal.prototype.constructor = Goal;
Goal.prototype.desc = function() {
	return "Unknown";
};
Goal.prototype.save = function() {
	var saved = {};

	saved.type = this.type;

	return saved;
};
Goal.prototype.load = function(saved) {
	this.type = saved.type;
};
Goal.load = function(saved) {
	var ret;
	switch(saved.type) {
		case GoalIncome.Type:
			ret = new GoalIncome();
			ret.load(saved);
			break;

		case GoalBuildAll.Type:
			ret = new GoalBuildAll();
			ret.load(saved);
			break;

		case GoalBuildOne.Type:
			ret = new GoalBuildOne();
			ret.load(saved);
			break;

		case GoalResources.Type:
			ret = new GoalResources();
			ret.load(saved);
			break;

		case GoalGenerate.Type:
			ret = new GoalGenerate();
			ret.load(saved);
			break;

		case GoalBuildingIncome.Type:
			ret = new GoalBuildingIncome();
			ret.load(saved);
			break;
	}

	return ret;
};

function GoalIncome() {
	this.type = GoalIncome.Type;
}
GoalIncome.prototype = Object.create(Goal.prototype);
GoalIncome.prototype.create = function(level) {
	this.income = Math.floor(5000 + 250 * level);
};
GoalIncome.prototype.desc = function() {
	return "Reach " + this.income + " income!";
};
GoalIncome.prototype.completed = function(place) {
	var needed = this.income;
	if(debug_mode()) needed = 5;
	return Math.floor(place.income() / needed * 100);
};
GoalIncome.prototype.save = function() {
	var saved = Goal.prototype.save.call(this);

	saved.income = this.income;

	return saved;
};
GoalIncome.prototype.load = function(saved) {
	Goal.prototype.load.call(this, saved);

	this.income = saved.income;
};
GoalIncome.Type = "income";

function GoalBuildAll() {
	this.type = GoalBuildAll.Type;
}
GoalBuildAll.prototype = Object.create(Goal.prototype);
GoalBuildAll.prototype.create = function(level) {
	/*
	this.min = index_roll(Math.random(), [1, 1/3, 1/5, 1/7, 1/9, 1/11, 1/13, 1/15]);
	var spread = index_roll(Math.random(), [1, 1/3, 1/5, 1/7, 1/9]) + 2;
	this.max = Math.min(leveldata[level].buildings.length - 1, this.min + spread);
	spread = this.max - this.min;
	*/
	this.min = 0;
	this.max = 4;
	this.count = Math.floor(30 + (5 * level) - 3 * this.min);
};
GoalBuildAll.prototype.desc = function() {
	return "Build " + this.count + " of tiers "+(this.min+1)+"-"+(this.max+1);
};
GoalBuildAll.prototype.completed = function(place) {
	var complete = 0;

	var needed = this.count;
	if(debug_mode()) needed = 1;

	for(var i=this.min; i<=this.max; i++) {
		complete += Math.min(needed, place.buildings[i].count());
	}

	return Math.floor(complete / (needed * (this.max - this.min + 1)) * 100);
};
GoalBuildAll.prototype.save = function() {
	var saved = Goal.prototype.save.call(this);

	saved.count = this.count;
	saved.min = this.min;
	saved.max = this.max;

	return saved;
};
GoalBuildAll.prototype.load = function(saved) {
	Goal.prototype.load.call(this, saved);

	this.count = saved.count;
	this.min = saved.min;
	this.max = saved.max;
};
GoalBuildAll.Type = "buildall";

function GoalBuildOne() {
	this.type = GoalBuildOne.Type;
}
GoalBuildOne.prototype = Object.create(Goal.prototype);
GoalBuildOne.prototype.create = function(level) {
	this.level = level;
	this.bid = index_roll(Math.random(), [1, 1/3, 1/5, 1/7, 1/9, 1/11, 1/13, 1/15, 1/17, 1/19]);
	this.count = Math.floor(50 + (6 * this.level) - (5 * this.bid));
};
GoalBuildOne.prototype.desc = function() {
	return "Build " + this.count + " " + leveldata[this.level].buildings[this.bid].name.capitalize();
};
GoalBuildOne.prototype.completed = function(place) {
	var needed = this.count;

	if(debug_mode()) needed = 1;

	return Math.floor(place.buildings[this.bid].count() / needed * 100);
};
GoalBuildOne.prototype.save = function() {
	var saved = Goal.prototype.save.call(this);

	saved.level = this.level;
	saved.count = this.count;
	saved.bid = this.bid;

	return saved;
};
GoalBuildOne.prototype.load = function(saved) {
	Goal.prototype.load.call(this, saved);

	this.level = saved.level;
	this.count = saved.count;
	this.bid = saved.bid;
};
GoalBuildOne.Type = "buildone";

function GoalResources() {
	this.type = GoalResources.Type;
}
GoalResources.prototype = Object.create(Goal.prototype);
GoalResources.prototype.create = function(level) {
	this.level = level;
	this.count = Math.floor(1000000 + (100000 * level));
};
GoalResources.prototype.desc = function() {
	return "Have " + this.count + " " + leveldata[this.level].currency.capitalize();
};
GoalResources.prototype.completed = function(place) {
	var needed = this.count;

	if(debug_mode()) needed = 100;

	return Math.floor(place.currency() / needed * 100);
};
GoalResources.prototype.save = function() {
	var saved = Goal.prototype.save.call(this);

	saved.count = this.count;
	saved.level = this.level;

	return saved;
};
GoalResources.prototype.load = function(saved) {
	Goal.prototype.load.call(this, saved);

	this.level = saved.level;
	this.count = saved.count;
};
GoalResources.Type = "resources";

function GoalGenerate() {
	this.type = GoalGenerate.Type;
}
GoalGenerate.prototype = Object.create(Goal.prototype);
GoalGenerate.prototype.create = function(level) {
	this.level = level;
	this.count = Math.floor(2000000 + (200000 * level));
};
GoalGenerate.prototype.desc = function() {
	return "Generate " + this.count + " " + leveldata[this.level].currency.capitalize();
};
GoalGenerate.prototype.completed = function(place) {
	var needed = this.count;

	if(debug_mode()) needed = 100;

	return Math.floor(place.total() / needed * 100);
};
GoalGenerate.prototype.save = function() {
	var saved = Goal.prototype.save.call(this);

	saved.count = this.count;
	saved.level = this.level;

	return saved;
};
GoalGenerate.prototype.load = function(saved) {
	Goal.prototype.load.call(this, saved);

	this.level = saved.level;
	this.count = saved.count;
};
GoalGenerate.Type = "generate";

function GoalBuildingIncome() {
	this.type = GoalBuildingIncome.Type;
}
GoalBuildingIncome.prototype = Object.create(Goal.prototype);
GoalBuildingIncome.prototype.create = function(level) {
	this.level = level;
	this.bid = index_roll(Math.random(), [1, 1/3, 1/5, 1/7, 1/9, 1/11, 1/13, 1/15, 1/17, 1/19]);
	this.income = Math.floor(leveldata[this.level].buildings[this.bid].income * (200 - 20 * this.bid + 100 * level));
};
GoalBuildingIncome.prototype.desc = function() {
	return "Have " + this.income + " income from " + leveldata[this.level].buildings[this.bid].name.capitalize();
};
GoalBuildingIncome.prototype.completed = function(place) {
	var needed = this.income;

	if(debug_mode()) needed = 100;

	return Math.floor(place.buildings[this.bid].income() * place.buildings[this.bid].count() / needed * 100);
};
GoalBuildingIncome.prototype.save = function() {
	var saved = Goal.prototype.save.call(this);

	saved.income = this.income;
	saved.bid = this.bid;
	saved.level = this.level;

	return saved;
};
GoalBuildingIncome.prototype.load = function(saved) {
	Goal.prototype.load.call(this, saved);

	this.level = saved.level;
	this.bid = saved.bid;
	this.income = saved.income;
};
GoalBuildingIncome.Type = "buildincome";
