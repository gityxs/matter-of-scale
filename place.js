var place_attr_array = ["baseincome", "income", "improve", "cost", "fasterupgrades"];

function Place(id, level) {
	// Constants
	this.id = id;
	this.level = level;

	// Non observables
	this.inject_data = {};

	// Value observables
	this.autobuy_enabled = ko.observable(null);
	this.autocomplete_enabled = ko.observable(null);
	this.autocomplete = ko.observable(-1);
	this.name = ko.observable(randomname(id, level));
	this.currency = ko.observable(-1);
	this.total = ko.observable(-1);

	this.goals = ko.observableArray();

	// Create research observables
	this.attrs = {};
	this.attr_arrays = {};
	for(var i=0; i<place_attr_array.length; i++) {
		var attr = place_attr_array[i];
		this.attr_arrays[attr] = ko.observableArray();
		this.attrs[attr] = array_sum_observable(this.attr_arrays[attr]);
	}

	// Create per-building observables
	this.buildings = [];

	// Upgrades
	this.upgrades = {};
	for(var i=0; i<upgrades.length; i++) {
		if(!upgrades[i].hasOwnProperty("bid"))
			this.upgrades[upgrades[i].type] = ko.observable(-1);
	}

	// Buildings
	for(var i=0; i<leveldata[0].buildings.length; i++) {
		this.buildings[i] = new Building(this, this.level, i);
	}

	// Derived observables
	this.count = this._count_observable();
	this.prestige = this._prestige_observable();
	this.completed = this._completed_observable();

	// Finish up buildings
	for(var i=0;i<leveldata[this.level].buildings.length; i++) {
		this.buildings[i].create_dependent();
	}

	this.income = this._income_observable();
}
Place.prototype.constructor = Place;
Place.prototype.load = function(saved) {
	this.id = saved.id;
	this.level = saved.level;

	this.reset();

	this.currency(saved.currency);
	this.name(saved.name);
	this.total(saved.total);
	this.autobuy_enabled(saved.autobuy_enabled);
	this.autocomplete_enabled(saved.autocomplete_enabled);
	this.autocomplete(saved.autocomplete);

	if(saved.goals) {
		for (var i = 0; i < saved.goals.length; i++) {
			this.goals.push(Goal.load(saved.goals[i]));
		}
	} else {
		this.create_goals();
	}

	for(var k in saved.upgrades) {
		if(!saved.upgrades.hasOwnProperty(k)) continue;
		if(!this.upgrades.hasOwnProperty(k)) continue;

		this.upgrades[k](saved.upgrades[k]);
	}

	for(var i=0; i<this.buildings.length; i++) {
		this.buildings[i].load(saved.buildings[i]);
	}
};
Place.prototype.save = function() {
	var saved = {};

	saved.id = this.id;
	saved.level = this.level;

	saved.currency = this.currency();
	saved.name = this.name();
	saved.total = this.total();
	saved.autobuy_enabled = this.autobuy_enabled();
	saved.autocomplete_enabled = this.autocomplete_enabled();
	saved.autocomplete = this.autocomplete();

	saved.upgrades = {};
	for(var k in this.upgrades) {
		if(!this.upgrades.hasOwnProperty(k)) continue;

		saved.upgrades[k] = this.upgrades[k]();
	}

	saved.goals = [];
	for(var i=0; i<this.goals().length; i++) {
		saved.goals.push(this.goals()[i].save());
	}

	saved.buildings = [];
	for(var i=0; i<this.buildings.length; i++) {
		saved.buildings[i] = this.buildings[i].save();
	}

	return saved;
};
Place.prototype.reset = function() {
	this.currency(0);
	this.total(0);
	this.autobuy_enabled(true);
	this.autocomplete_enabled(true);
	this.autocomplete(0);
	this.goals([]);

	for(var k in this.upgrades) {
		if(!this.upgrades.hasOwnProperty(k)) continue;

		this.upgrades[k](0);
	}

	for(var i=0; i<this.buildings.length; i++)
		this.buildings[i].reset();
};
Place.prototype.complete = function(autocompleted) {
	var vl = game.levels[this.level];

	var cur = vl.currency();
	vl.currency(cur + this.prestige());

	if(!autocompleted)
		ga('send', 'event', 'progression', 'nodecomplete', this.level.toString());
	else
		ga('send', 'event', 'progression', 'autocomplete', this.level.toString());

	if(game.govs.limit() === 0) {
		governor_limit_raise(1);
	}

	game.complete(this);
};
Place.prototype.create_goals = function() {
	var index = 0;
	var list = [GoalIncome, GoalBuildAll, GoalBuildOne, GoalResources, GoalGenerate, GoalBuildingIncome];
	if(this.id > 1) {
		index = rand(0, list.length);
	}
	var goal = new list[index]();

	goal.create(this.level);

	this.goals.push(goal);
};
/** @param {Attr} attr **/
Place.prototype.attr_inject = function(attr) {
	this.inject_data[attr.id];

	var data = null;
	switch(attr.type) {
		case "synergy":
			data = {"attr":"income", "obs": this._attr_synergy_observable(attr)};
			break;
		default:
			data = {"attr" : attr.type, "obs": this._attr_val(attr)};
			break;
	}

	if(attr.components.bid != null && attr.components.bid.bid != null) {
		data.bid = attr.components.bid.bid;
	}
	if(attr.components.bid2 != null && attr.components.bid2.bid2 != null) {
		data.bid2 = attr.components.bid.bid2;
	}

	if(data != null) {
		this.inject_data[attr.id] = data;

		if(data.bid != null) {
			if(data.bid2 != null)
				this.buildings[data.bid].synergies[data.bid2].attr_arrays[data.attr].push(data.obs);
			else
				this.buildings[data.bid].attr_arrays[data.attr].push(data.obs);
		}
		else
			this.attr_arrays[data.attr].push(data.obs);
	}
};
Place.prototype.attr_excise = function(attr) {
	if(!this.inject_data.hasOwnProperty(attr.id)) return;

	var data = this.inject_data[attr.id];
	if(data != null) {
		if(data.bid != null) {
			if(data.bid2 != null)
				this.buildings[data.bid].synergies[data.bid2].attr_arrays[data.attr].remove(data.obs);
			else
				this.buildings[data.bid].attr_arrays[data.attr].remove(data.obs);
		}
		else
			this.attr_arrays[data.attr].remove(data.obs);

		delete this.inject_data[attr.id];
	}
};
Place.prototype._income_observable = function() {
	var self = this;
	return ko.computed(function() {
		var income = 0;
		var vl = game.levels[self.level];

		for(var i=0; i<leveldata[self.level].buildings.length; i++) {
			var vb = self.buildings[i];
			income += vb.income() * vb.count();
		}

		income += game.levels[self.level].attrs.flatinc();
		income += self.attrs.baseincome();

		var mult = self.attrs.income();

		return income * (1 + mult/100);
	});
};
Place.prototype._attr_synergy_observable = function(attr) {
	var val = attr.components.val.val;
	var bid = attr.components.bid.bid;

	var self = this;
	if(attr.components.bid2) {
		var bid2 = attr.components.bid2.bid;
		return ko.computed(function() {
			return self.buildings[bid2].count() * val;
		});
	} else {
		return ko.computed(function() {
			return self.count() * val;
		});
	}
};
Place.prototype._attr_val = function(attr) {
	var val = attr.components.val.val;

	var self = this;
	return ko.computed(function() {
		return val;
	});
};
Place.prototype._count_observable = function() {
	var self = this;
	return ko.computed(function() {
		var val = 0;
		for(var i=0; i<self.buildings.length; i++) {
			val += self.buildings[i].count();
		}
		return val;
	});
};
Place.prototype._completed_observable = function() {
	var self = this;
	return ko.computed(function() {
		var completed = 0;

		if(debug_force_complete() == self.id) return 100;

		for(var i=0; i<self.goals().length; i++) {
			var goal = self.goals()[i];
			completed += goal.completed(self);
		}

		return Math.min(100, Math.floor(completed));
	});
};
Place.prototype._prestige_observable = function() {
	var self = this;
  return ko.computed(function() {
    var extra = 0;
		if(self.total() > 0)
			extra = Math.floor(Math.log(self.total() / 100000) / Math.log(1.5));
    return 10 + Math.max(0, extra);
  });
};
Place.prototype.upgrade_rank = function(upgrade) {
	if(upgrade.hasOwnProperty("bid"))
		return this.buildings[upgrade.bid].upgrades[upgrade.type].rank;
	else
		return this.upgrades[upgrade.type];
};
Place.prototype.building_unlocked = function(bid) {
	return true;
	/* 0.09 - Remove building unlock upgrades
  if(bid < 5) return true;

  var rank = this.upgrades["bid_unlock"]();

  return rank >= (bid - 4);
  */
};
Place.prototype.tree_name = function() {
	var name = this.name();
	if(this.completed() >= 100)
		name += " (Completed)";
	else
		name += " " + this.completed() + "%";

	return name;
};
Place.new_node = function(id, level) {
	var starting_currency = 10;
	if(game) {
		var resval = game.levels[level].attrs.starter();
		if(resval !== 0) starting_currency = resval;
	}

	var starting_upgrade_pts = 0;

	var place = new Place(id, level);
	place.reset();
	place.currency(starting_currency);

	place.create_goals();

	return place;
};
Place.prototype.tick_auto_complete = function(elapsed) {
	if(this.completed() < 100) return;
	if(!this.autocomplete_enabled()) return;

	var total = game.levels[this.level].attrs.autocomplete();

	if(total <= 0) return;

	this.autocomplete(this.autocomplete() + elapsed);

	if(this.autocomplete() >= total) {
		this.complete(true);
	}
};
Place.prototype.tick_auto_buy = function(gain, elapsed) {
	if(!this.autobuy_enabled()) return gain;

	var vl = game.levels[this.level];
	for(var i=0; i<leveldata[this.level].buildings.length; i++) {
		var rate = vl.buildings[i].attrs.autobuy() + this.buildings[i].attrs.autobuy();

		if(rate > 0) {
			var actual = Math.min(gain, rate * elapsed);

			gain -= actual;

			this.buildings[i].autobuy(this.buildings[i].autobuy() + actual);

			var mult = vl.buildings[i].attrs["autopct"]() / 100;
			if(mult == 0) mult = 2.5;
			mult -= this.buildings[i].attrs.autopct() / 100;
			var cost = this.buildings[i].cost() * mult;
			if(this.buildings[i].autobuy() >= cost) {
				this.building_add(i, 1);
				this.buildings[i].autobuy(this.buildings[i].autobuy() - cost);
				game.stats.levels[this.level].buildings[i].autobuy(game.stats.levels[this.level].buildings[i].autobuy() + 1);
			}

			if(gain <= 0) {
				gain = 0; break;
			}
		}
	}

	return gain;

};
Place.prototype.tick = function(elapsed) {
	this.tick_auto_complete(elapsed);

	var gain = this.income() * elapsed;
	if(gain > 0) {
		// Increment raw-total counters
		this.total(this.total() + gain);
		game.stats.total(game.stats.total() + gain);

		// Deduct auto_buy_reservation
		gain = this.tick_auto_buy(gain, elapsed);

		// Add remaining to currency
		this.currency(this.currency() + gain);

		var vl = game.stats.levels[this.level];
		vl.income(vl.income() + gain);
		if(this.income() > vl.max_income())
			vl.max_income(this.income());
	}
};
Place.prototype.building_add = function(bid, count) {
	var vb = this.buildings[bid];
	vb.count(vb.count() + count);
};
Place.prototype.building_buy = function(bid, count) {
	var cost = this.buildings[bid].cost();
	if(debug_mode()) cost = 0;
	if(this.currency() < cost) return false;
	if(!this.building_unlocked(bid)) return false;

	this.currency(this.currency() - cost);
	this.building_add(bid, 1);

	game.stats.levels[this.level].buildings[bid].count(game.stats.levels[this.level].buildings[bid].count() + 1);

	ga('send', 'event', 'gameplay', 'building-buy', ""+this.level+"-"+bid);

	return true;
};
Place.prototype.upgrade_buy = function(idx) {
	var upg = upgrades[idx];

	var rankobs = this.upgrade_rank(upg);

	var base = upg.cost(this.level, rankobs() + 1);
	var cost = this.upgrade_cost(base, upg.bid);

	var level = game.levels[this.level];

	var vb = this.buildings[upg.bid];
	if(vb.count() <= 0)
		return;

	if(level.upgradepts() < cost) return;  // Can't afford

	level.upgradepts(level.upgradepts() - cost);
	rankobs(rankobs() + 1);

	ga('send', 'event', 'gameplay', 'upgrade-buy', this.level+"_"+upg.type);
};
Place.prototype.upgrade_cost = function(base, bid) {
	var mult = 0;

	var eff_mult = Math.min(100, mult);
	return Math.floor(base * (1 - eff_mult / 100));
};
Place.prototype.autobuy_owned = function() {
	for(var i=0; i<this.buildings.length; i++) {
		if(game.levels[this.level].buildings[i].attrs.autobuy() > 0) return true;
		if(this.buildings[i].attrs.autobuy() > 0) return true;
	}
	return false;
};
