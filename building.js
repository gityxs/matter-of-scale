var build_attr_array = ["income", "cost", "autobuy", "autopct"];

var child_attr_array = ["income"];

function AttrSet(name, attrs) {
	this.name = name;
	this.attrs = {};
	this.attr_arrays = {};

	for(var j=0; j<attrs.length; j++) {
		var attr = attrs[j];

		this.attr_arrays[attr] = ko.observableArray([]);
		this.attrs[attr] = array_sum_observable(this.attr_arrays[attr]);
	}
}
AttrSet.prototype.constructor = AttrSet;

function Building(place, level, bid) {
	this.level = level;
	this.place = place;
	this.bid = bid;
	this.count = ko.observable(-1);
	this.autobuy = ko.observable(-1);

	this.attrs = {};
	this.attr_arrays = {};

	for(var j=0; j<build_attr_array.length; j++) {
		var attr = build_attr_array[j];

		this.attr_arrays[attr] = ko.observableArray([]);
		this.attrs[attr] = array_sum_observable(this.attr_arrays[attr]);
	}

	this.synergies = [];
	for(var i=0; i<leveldata[this.level].buildings.length; i++) {
		this.synergies[i] = new AttrSet("synergy", child_attr_array);
	}

	this.upgrades = {};
	for(var i=0; i<upgrades.length; i++) {
		if(upgrades[i].bid == this.bid) {
			this.upgrades[upgrades[i].type] = {};
			this.upgrades[upgrades[i].type].rank = ko.observable(-1);
			this.upgrades[upgrades[i].type].base = upgrades[i];
		}
	}
}
Building.prototype.constructor = Building;
Building.prototype.load = function(saved) {
	this.count(saved.count);
	this.autobuy(saved.autobuy);

	for(var k in saved.upgrades) {
		if(!saved.upgrades.hasOwnProperty(k)) continue;

		this.upgrades[k].rank(saved.upgrades[k].rank);
	}
};
Building.prototype.save = function() {
	var saved = {};

	saved.count = this.count();
	saved.autobuy = this.autobuy();

	saved.upgrades = {};
	for(var k in this.upgrades) {
		if(!this.upgrades.hasOwnProperty(k)) continue;

		saved.upgrades[k] = {};
		saved.upgrades[k].rank = this.upgrades[k].rank();
	}

	return saved;
};
Building.prototype.reset = function() {
	this.count(0);
	this.autobuy(0);

	for(var k in this.upgrades) {
		if(!this.upgrades.hasOwnProperty(k)) continue;

		this.upgrades[k].rank(0);
	}
};
Building.prototype.create_dependent = function() {
	this.attr_arrays.income.push(this._attr_income_observable());

	this.cost = this._cost_observable();
	this.income = this._income_observable();
};
Building.building_name = function(level, bid) {
	return leveldata[level].buildings[bid].name.capitalize();
};
Building.prototype.name = function() {
	return Building.building_name(this.level, this.bid);
};
Building.prototype._attr_income_observable = function() {
	var self = this;
	return ko.computed(function() {
		var upgrade = self.upgrades["income"].base.val(self.level, self.upgrades["income"].rank());
		
		return upgrade;
	});
};
Building.prototype._cost_observable = function() {
	var self = this;
	return ko.computed(function() {
		var base = leveldata[self.level].buildings[self.bid].cost;
		var count = self.count();
		var expign = game.levels[self.level].attrs.expign();
		
		var count_eff = Math.max(count - expign, 0);
		var discount = game.levels[self.level].attrs.cost() + self.place.attrs.cost() + self.attrs.cost();
		discount = Math.min(95, discount); // Limit to 95% off

		var pow = 1.1 - 0.008 * self.bid;
		var cost = Math.floor(base * Math.pow(pow, count_eff) * (1 - discount / 100));
		return Math.max(1, cost);
	});
};
Building.prototype._income_observable = function() {
	var self = this;
	return ko.computed(function() {
		var base = leveldata[self.level].buildings[self.bid].income;

		var synergy = 0;
		for(var i=0; i<self.synergies.length; i++) {
			synergy += self.synergies[i].attrs.income();
		}
		
		var pattr = self.place.attrs.income();
		var battr = self.attrs.income();
		
		return Math.floor(base * (1 + pattr/100) * (battr / 100) * (1 + synergy / 100));
	});
};
