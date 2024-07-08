var global_attrs = ["time_curr_rate", "time_curr_dur"];

var minversion = 8;
var cur_version = 9;
var game_version = "00.10";

function Game() {
	this.version = cur_version;
	this.cur_id = 0;

	this.now = ko.observable(-1);
	this.max_level = ko.observable(-1);
	this.time_currency = ko.observable(-1);
	this.time_currency_whole = bind_wrap(this.time_currency, Math.floor);

	this.places = ko.observableArray([]);
	this.places.subscribe(this.handle_place_changes, this, "arrayChange");

	this.governors = ko.observableArray([]);
	this.levels = [];
	this.stats = new Stats();

	this.govs = {
		limit: ko.observable(-1)
	};

	this.attrs = {};
	this.attr_arrays = {};
	for(var i=0; i<global_attrs.length; i++) {
		var attr = global_attrs[i];
		this.attr_arrays[attr] = ko.observableArray();
		this.attrs[attr] = array_sum_observable(this.attr_arrays[attr]);
	}

	this.actives = ko.observableArray();
	this.nextactive = [];

	// Level observables
	for(var i=0; i<leveldata.length; i++) {
		this.levels[i] = new Level(this, i);
	}

	this.magic_find = this._magic_find_observable();

	this.tabs = [
		{"title": "Scale", "width": 250, "enabled": true, "content": HierarchyHelpers.view},
		{title: "Debug", "width": 400, enabled: false, element: OptimizerView },
		{"title": "Local", "width": 400, "enabled": true, "content": function() { return React.createElement(PlaceView, {place: view_place()}); }},
		{"title": "Upgrades", "width": 400, "enabled": true, "element": UpgradeView},
		{"title": "Research", "width": 400, "enabled": true, "element": ResearchView },
		{"title": "Managers", "width": 400, "enabled": true, "element": ManagerView },
		{"title": "Stats", "width": 400, "enabled": true, "element": StatView },
		{"title": "Feats", "width": 400, "enabled": true, "element": FeatView },
		{"title": "Support", "width": 400, "enabled": true, "element": SocialView },
		{"title": "Options", "width": 400, "enabled": true, "element": OptionView }
	];
	this.tabsWidth = 400;
}
Game.prototype.constructor = Game;
Game.prototype.save = function() {
	var saved = {};

	saved.options = app.game.options.save();

	saved.version = this.version;
	saved.max_level = this.max_level();

	saved.time_currency = this.time_currency();
	saved.gov_limit = this.govs.limit();

	saved.governors = [];
	for(var i=0; i<this.governors().length; i++) {
		saved.governors[i] = this.governors()[i].save();
	}

	saved.places = [];
	for(var i=0; i<this.places().length; i++) {
		saved.places.push(this.places()[i].save());
	}

	saved.levels = [];
	for(var i=0; i<this.levels.length; i++) {
		saved.levels.push(this.levels[i].save());
	}

	saved.stats = this.stats.save();

	return saved;
};
Game.prototype.load = function(saved) {
	versionupgrade(saved);

	if(saved.version < minversion) {
		return "Load.MinVersion";
	}

	this.reset(true);

	if(saved.max_level)		// Remove on version change
		this.max_level(saved.max_level);
	this.time_currency(saved.time_currency);
	this.govs.limit(saved.gov_limit);

	this.version = cur_version;

	app.game.options.load(saved.options);

	this.governors.splice(0);
	for(var i=0; i<saved.governors.length; i++) {
		this.governors.push(new Governor());
		this.governors[i].load(saved.governors[i]);
	}

	for(var i=0; i<saved.levels.length; i++) {
		this.levels[i].load(saved.levels[i]);
	}

	this.places([]);
	for(var i=0; i<saved.places.length; i++) {
		var sp = saved.places[i];

		var place = this.place_new(sp.level, true);
		place.load(sp);
		this.places.push(place);

		if(place.id >= this.cur_id) this.cur_id = place.id + 1;
	}

	for(var i=0; i<saved.governors.length; i++) {
		this.governors[i].postload(saved.governors[i]);
	}

	if(saved.stats)
		this.stats.load(saved.stats);
};
Game.prototype.reset = function(hard) {
	var stats = null;
	if(!hard) stats = this.stats.save();

	this.time_currency(0);
	this.govs.limit(0);

	app.game.options.reset();

	cur_id = 0;
	this.now(performance.now());
	this.governors.splice(0);
	this.places([]);

	this.stats.reset();

	for(var i=0; i<this.levels.length; i++) {
		this.levels[i].reset();
	}

	if(stats) this.stats.load(stats);
};
Game.prototype.new_game = function() {
	this.reset();
};
Game.prototype.start = function() {
	this.nextactive.push(new ActTimeCurrency(active_time_start()));
	for(var i=0; i<leveldata.length; i++) {
		this.nextactive.push(new ActResearchPoint(active_time_start(), i));
		this.nextactive.push(new ActUpgradePoint(active_time_start(), i));
	}

	dispatcher.register("loc-click", function(data) {
		view_place(data.place);
	});
	dispatcher.register("buy-start", function(data) {
		purchase_start(data.bid);
	});

	var game = this;
	dispatcher.register("complete-attempt", function(data) {
		game.get_place(data.pid).complete(false);
	});

	dispatcher.register("research-attempt", function(data) {
		game.research_buy(data.research.idx);
	});

	dispatcher.register("upgrade-attempt", function(data) {
		view_place().upgrade_buy(data.upgrade.idx);
	});

	dispatcher.register("click-mute", app.game.options.toggleMute);
	dispatcher.register("click-pause", pause);
	dispatcher.register("click-reset", resetsoft);
	dispatcher.register("click-wipe", resethard);
	dispatcher.register("click-save", savebutton);
	dispatcher.register("click-export", buttonexport);
	dispatcher.register("click-import", buttonimport);
	dispatcher.register("click-patchnotes", buttonpatchnotes);
	dispatcher.register("click-debug", debugtoggle);

	dispatcher.register("res-curr-click", function (data) {
		res_view_level(data.level);
	});

	dispatcher.register("autocomplete-click", function(data) {
		view_place().autocomplete_enabled(!view_place().autocomplete_enabled());
	});

	dispatcher.register("autobuy-click", function(data) {
		view_place().autobuy_enabled(!view_place().autobuy_enabled());
	});
};
Game.prototype.tick = function(elapsed, catchup) {
	this.now(performance.now());

	in_update(true);

	this.stats.tick(elapsed);

	this.time_currency(this.time_currency() + elapsed / time_currency_rate);

	for(var i=0; i<this.levels.length; i++) {
		this.levels[i].tick(elapsed);

		if(this.levels[i].remaining() == 0) {
			this.place_add(i);

			this.levels[i-1].constructed(0);
		}
	}

	for(var i=0; i<this.places().length; i++) {
		this.places()[i].tick(elapsed);
	}

	while(this.levels[0].attrs.numactive() > this.levels[0].places().length) {
		this.place_add(0);
	}

	for(var i=0; i<this.governors().length; i++) {
		if(this.governors()[i] != null)
			this.governors()[i].tick(elapsed);
	}

	if(!catchup)
		updateactives(elapsed);

	in_update(false);
};
Game.prototype.place_new = function(level, noevent) {
	var place = Place.new_node(this.cur_id++, level);
	if(!noevent)
		this.places.push(place);
	return place;
};
Game.prototype.place_add = function(level, noevent) {
	var place = this.place_new(level, noevent);

	return place;
};
Game.prototype.complete = function(place) {
	this.stats.levels[place.level].completed(this.stats.levels[place.level].completed() + 1);

	if(place.level < leveldata.length - 1) {
		var next_level = place.level + 1;
		this.levels[place.level].constructed(this.levels[place.level].constructed() + 1);

		if(this.levels[next_level].remaining() <= 0) {
			this.place_add(next_level);

			this.levels[place.level].constructed(0);
		}
	}

	this.place_del(place);
};
Game.prototype.handle_place_changes = function(changes, other) {
	for(var i=0; i<changes.length; i++) {
		var change = changes[i];

		var place = change.value;
		if(change.status == "added") {

			this.levels[place.level].place_add(place);

			if(place.level > this.max_level())
				this.max_level(place.level);
		} else if(change.status == "deleted") {
			this.levels[place.level].places.remove(place);
		}
	}
};
Game.prototype.place_del = function(place) {
	var level = game.levels[place.level];
	if(level.assigned() >= 0) {
		this.get_gov(level.assigned()).excise_place(place);
	}

	level.places.splice(level.places.indexOf(place), 1);
	this.places.splice(this.places.indexOf(place), 1);

	$(eventobj).trigger("nodedelete", place);
};
Game.prototype.attr_inject = function(attr) {
	attr.injectdata = {attr: attr.type, obs: level_attr_obs(attr)};

	if(attr.injectdata != null) {
		if(attr.injectdata.bid != null)
			throw "Invalid attr";
		else
			this.attr_arrays[attr.injectdata.attr].push(attr.injectdata.obs);
	}
};
Game.prototype.research_buy = function(idx) {
	var level = res_view_level();
	var res = researches[idx];

	var rankobs;
	if(res.hasOwnProperty("bid"))
		rankobs = this.levels[level].buildings[res.bid].ranks[res.type];
	else
		rankobs = this.levels[level].ranks[res.type];

	var cost = res.cost(level, rankobs() + 1);

	if(this.levels[level].currency() < cost[level]) return;
	this.levels[level].currency(this.levels[level].currency() - cost[level]);
	rankobs(rankobs()+1);

	ga('send', 'event', 'gameplay', 'research-buy', res.type);
};
Game.prototype.get_place = function(id) {
	for(var i=0; i<this.places().length; i++) {
		if(this.places()[i].id == id) return this.places()[i];
	}
	return null;
};
Game.prototype.get_gov = function(id) {
	return this.governors[id];
};
Game.prototype._magic_find_observable = function() {
	var self = this;
	return ko.computed(function() {
		var sum = 0;
		for(var i=0; i<leveldata.length; i++) {
			sum += self.stats.levels[i].completed() * Math.pow(2, i - 1);
		}
		return sum;
	});
};


