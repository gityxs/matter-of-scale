var govid = 0;

var gov_xp_rate = 1;
var gov_levels = [0, 200, 600, 1000, 2500, 5000, 12500, 25000, 125000, 250000, 375000, 500000, 625000, 750000, 875000, 1000000];
var slot_cost;
var retrain_cost;

var maxgovs = 50;
var selected_gov = ko.observable(-1);

var attr_ids = 0;

function governor_select(evt) {
	if(evt.data >= game.govs.limit()) return;

	if(selected_gov() == evt.data) {
		selected_gov(-1);
	} else {
		selected_gov(evt.data);
	}
}

function governor_limit_raise(amt) {
  game.govs.limit(game.govs.limit() + amt);

  for(var i=0; i<amt; i++)
    game.governors.push(new Governor());
}

function governor_volitile_create() {
  slot_cost = governor_slot_cost(game.govs.limit);
  retrain_cost = governor_retrain_cost(game.govs.limit, selected_gov);
}

function governor_slot_cost(slot_count_obs) {
  return ko.computed(function() {
    return slot_count_obs() * 10;
  });
}

function governor_retrain_cost(slot_count_obs, selected_gov) {
  return ko.computed(function() {
    if(slot_count_obs() < 0) return null;
    return 5;
  });
}

function Governor() {
  this.id = game.governors().length;
	this.mods = [];

	this.rarity = ko.observable(-1);
  this.gender = Math.random() >= 0.5;
  this.xp = ko.observable(0);
  this.level = this._level_observable(this.xp);
  this.name = ko.observable(randomperson(this.gender));
  this.assigned = ko.observable(-1);
	this.iteration = ko.observable(-1);

  this.retrain();

  game.governors[this.id] = this;
}
Governor.prototype.constructor = Governor;
Governor.prototype.save = function() {
	var saved = {};

	saved.rarity = this.rarity();
	saved.xp = this.xp();
	saved.name = this.name();
	saved.assigned = this.assigned();
	saved.gender = this.gender;
	saved.id = this.id;

	saved.mods = [];
	for(var i=0; i<this.mods.length; i++) {
		saved.mods.push(this.mods[i].save());
	}

	return saved;
};
Governor.prototype.load = function(saved) {
	var iter = this.iteration();
	this.reset();

	this.rarity(saved.rarity);
	this.xp(saved.xp);
	this.name(saved.name);
	this.gender = saved.gender;

	this.mods.splice(0);
	for(var i=0; i<saved.mods.length; i++) {
		this.mods.push(new Mod());
		this.mods[i].load(saved.mods[i]);
	}

	this.iteration(iter + 1);
};
Governor.prototype.postload = function(saved) {
	if(saved.assigned < 0) return;

	this.assign(game.levels[saved.assigned]);
};
Governor.prototype.reset = function() {
	this.iteration(0);
};
Governor.prototype.allowed = function(level) {
	return this.level() >= level + 1;
};
Governor.prototype.allowed_obs = function(vp) {
	return ko.computed(function() { return this.allowed(vp); });
};
Governor.prototype.inject_place = function(place) {
	for(var i=0; i<this.mods.length; i++) {
		var mod = this.mods[i];
		for(var j=0; j<mod.attrs.length; j++) {
			place.attr_inject(mod.attrs[j]);
		}
	}
};
Governor.prototype.inject = function() {
	for(var i=0; i<game.levels[this.assigned()].places().length; i++) {
		var place = game.levels[this.assigned()].places()[i];

		this.inject_place(place);
	}
};
Governor.prototype.excise_place = function(place) {
	for(var i=0; i<this.mods.length; i++) {
		var mod = this.mods[i];
		for(var j=0; j<mod.attrs.length; j++) {
			place.attr_excise(mod.attrs[j]);
		}
	}
};
Governor.prototype.excise = function() {
	for(var i=0; i<game.levels[this.assigned()].places().length; i++) {
		var place = game.levels[this.assigned()].places()[i];

		this.excise_place(place);
	}
};
Governor.prototype.create_mod = function() {
  var moddef = govModDB.get();
  var mod = moddef.instantiate();

  return mod;
};
Governor.prototype.assign = function(level) {
	if(this.assigned() == level.level) return;

  this.unassign();

  if(level.assigned() >= 0)
    game.governors[level.assigned()].unassign();

  level.assigned(this.id);
  this.assigned(level.level);
  this.inject();
};
Governor.prototype.unassign = function() {
  if(this.assigned() < 0) return;

  var level = game.levels[this.assigned()];
	this.excise();
  level.assigned(-1);
  this.assigned(-1);
};
Governor.prototype.tick = function(elapsed) {
  if(this.assigned() < 0) return;

  this.xp(this.xp() + gov_xp_rate * elapsed);
};
Governor.prototype.retrain = function() {
  if(this.assigned() >= 0) {
    this.excise();
  }

  var mf = game.magic_find();

  this.mods = [];
	var new_rarity = index_roll(Math.random(), [1, 1/3, 1/10, 1/40, 1/200, 1/1000, 1/10000], 1 + mf / 100);
	var i = 0;
	while(new_rarity == this.rarity() && !(new_rarity == 6 && this.rarity() == 6) && i < 100) {
		new_rarity = index_roll(Math.random(), [1, 1/3, 1/10, 1/40, 1/200, 1/1000, 1/10000], 1 + mf / 100);
		i += 1;
	}
  this.rarity(new_rarity);
  for(var i=0; i<= this.rarity(); i++) {
    this.mods.push(this.create_mod());
  }

  if(this.assigned() >= 0) {
    this.inject();
  }

	this.iteration(this.iteration() + 1);
};
Governor.prototype._level_observable = function() {
	var self = this;
	return ko.computed(function() {
		var level = 0;
		for(var i=0; i < gov_levels.length; i++) {
			if(self.xp() >= gov_levels[i]) level = i + 1;
		}

		return level;
	});
};

