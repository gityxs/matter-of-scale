var level_attrs = ["upgrade_rate", "upgrade_dur", "prestige_rate", "prestige_dur", "cost", "starter", "flatinc", "expign", "upgspd", "numactive", "autocomplete", "autobuy", "autopct", "locrequired"];
var building_attrs = ["autobuy", "autopct"];

function LevelBuilding(level, bid) {
	this.level = level;
	this.bid = bid;

	this.attrs = {};
	this.attr_arrays = {};

	for(var i=0; i<building_attrs.length; i++) {
		var attr = building_attrs[i];

		this.attr_arrays[attr] = ko.observableArray([]);
		this.attrs[attr] = array_sum_observable(this.attr_arrays[attr]);
	}

	this.ranks = {};
	for(var i=0; i<researches.length; i++) {
		var res = researches[i];

		if(res.bid == this.bid) {
			this.ranks[res.type] = ko.observable(-1);

			this.attr_arrays[res.type].push(research_val_observable_rank(res, this.ranks[res.type], this.level));
		}
	}
}
LevelBuilding.prototype.constructor = LevelBuilding;
LevelBuilding.prototype.save = function() {
	var saved = {};

	saved.ranks = {};
	for(var k in this.ranks) {
		if(!this.ranks.hasOwnProperty(k)) continue;

		saved.ranks[k] = this.ranks[k]();
	}

	return saved;
};
LevelBuilding.prototype.load = function(saved) {
	this.reset();

	for(var k in this.ranks) {
		if(!saved.ranks.hasOwnProperty(k)) continue;

		this.ranks[k](saved.ranks[k]);
	}
};
LevelBuilding.prototype.reset = function() {
	for(var k in this.ranks) {
		if(!this.ranks.hasOwnProperty(k)) continue;

		this.ranks[k](0);
	}
};

function Level(game, level) {
	this.game = game;
	this.level = level;

	this.currency = ko.observable(-1);
	this.constructed = ko.observable(-1);
	this.upgradepts = ko.observable(-1);

	this.places = ko.observableArray([]);
	this.assigned = ko.observable(-1);

	this.buildings = [];
	for(var i=0; i<leveldata[level].buildings.length; i++) {
		this.buildings[i] = new LevelBuilding(level, i);
	}

	this.ranks = {};

	this.attrs = {};
	this.attr_arrays = {};

	for(var i=0; i<level_attrs.length; i++) {
		var attr = level_attrs[i];
		this.attr_arrays[attr] = ko.observableArray();
		this.attrs[attr] = array_sum_observable(this.attr_arrays[attr]);
	}

	for(var i=0; i<researches.length; i++) {
		var res = researches[i];

		if(res.bid == undefined) {
			this.ranks[res.type] = ko.observable(-1);

			this.attr_arrays[res.type].push(research_val_observable_rank(res, this.ranks[res.type], level));
		}
	}

	this.upgrade_rate = this._upgrade_rate_observable();
	this.remaining = this._remaining_observable();
}
Level.prototype.constructor = Level;
Level.prototype.save = function() {
	var saved = {};

	saved.currency = this.currency();
	saved.constructed = this.constructed();
	saved.upgradepts = this.upgradepts();

	saved.buildings = [];
	for(var i=0; i<this.buildings.length; i++) {
		saved.buildings[i] = this.buildings[i].save();
	}

	saved.ranks = {};
	for(var k in this.ranks) {
		if(!this.ranks.hasOwnProperty(k)) continue;

		saved.ranks[k] = this.ranks[k]();
	}

	return saved;
};
Level.prototype.load = function(saved) {
	this.reset();

	this.currency(saved.currency);

	if(saved.constructed >= 0)
		this.constructed(saved.constructed);

	if(saved.upgradepts && saved.upgradepts >= 0)
		this.upgradepts(saved.upgradepts);

	for(var i=0; i<this.buildings.length; i++) {
		this.buildings[i].load(saved.buildings[i]);
	}

	if(saved.ranks) {
		for(var k in saved.ranks) {
			if(!saved.ranks.hasOwnProperty(k)) continue;

			this.ranks[k](saved.ranks[k]);
		}
	}
};
Level.prototype.reset = function() {
	this.currency(0);
	this.constructed(4);
	this.assigned(-1);
	this.upgradepts(0);

	for(var k in this.ranks) {
		if(!this.ranks.hasOwnProperty(k)) continue;

		this.ranks[k](0);
	}

	for(var i=0; i<this.buildings.length; i++) {
		this.buildings[i].reset();
	}
};
Level.prototype.attr_inject = function(attr) {
	attr.injectdata = {attr: attr.type, obs: level_attr_obs(attr)};

	if(attr.injectdata != null) {
		if(attr.injectdata.bid != null)
			this.buildings[attr.injectdata.bid].attr_arrays[attr.injectdata.attr].push(attr.injectdata.obs);
		else
			this.attr_arrays[attr.injectdata.attr].push(attr.injectdata.obs);
	}
};
Level.prototype.place_add = function(place) {
	this.places.push(place);

	if(this.assigned() >= 0) {
		this.game.get_gov(this.assigned()).inject_place(place);
	}
};
Level.prototype._upgrade_rate_observable = function() {
	var self = this;
	return ko.computed(function() {
		var level = self.level;
		var desired_time = 4 * (level + 1) * 60;
		var rate = 1 / desired_time;

		var mult = self.attrs.upgspd();

		return rate * (1 + mult / 100);
	});
};
Level.prototype._remaining_observable = function() {
	var self = this;
	return ko.computed(function() {
		if(self.level == 0) return 100;
		return self.attrs.locrequired() - self.game.levels[self.level - 1].constructed();
	});
};
Level.prototype.tick = function(elapsed) {
	var gain = this.upgrade_rate() * elapsed;
	this.upgradepts(this.upgradepts() + gain);
};
Level.random_place = function(level) {
	if(game.levels[level].places().length === 0) return null;

	var idx = Math.floor(game.levels[level].places().length * Math.random());
	return game.levels[level].places()[idx];
};

function level_attr_obs(attr) {
	var val = attr.components.val.val;

	return ko.observable(val);
}

function level_num_active_bind(level) {
	return function(value) {
		if(value <= 0) return;

		while(game.levels[level].places().length < value) {
			game.place_add(level, false);
		}
	};
}

function bindlevels() {
	for(var i=0; i<leveldata.length; i++) {
		var vl = game.levels[i];

		//if(i==0)
		//	vl.attrs.numactive.subscribe(level_num_active_bind(i));
	}
}
