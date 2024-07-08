
function UpgIncome(bid) {
	ResDefault.call(this);

	this.bid = bid;
	this.type = "income";
	this.maxrank = 4;
}
UpgIncome.prototype = Object.create(ResDefault.prototype);
UpgIncome.prototype.constructor = UpgIncome;
UpgIncome.prototype.cost = function(level, rank, display) {
	if(!display && debug_mode()) return 0;
	return Math.floor(this.bid/3) + rank;
};
UpgIncome.prototype.val = function(level, rank) { if(rank < 0) return -1; return 100 * Math.pow(2, rank); };
UpgIncome.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	return "Doubles "+ld.buildings[this.bid].name.capitalize()+" income";
};

function UpgBuildingUnlock() {
  ResDefault.call(this);

  this.type = "bid_unlock";
  this.maxrank = 5;
}
UpgBuildingUnlock.prototype = Object.create(ResDefault.prototype);
UpgBuildingUnlock.prototype.constructor = UpgBuildingUnlock;
UpgBuildingUnlock.prototype.cost = function(level, rank, display) {
  if(!display && debug_mode()) return 0;

  return Math.floor(rank / 2) + 1;
};
UpgBuildingUnlock.prototype.val = function(level, rank) { if(rank < 0) return -1; return rank + 5; };
UpgBuildingUnlock.prototype.desc = function(level, rank) {
  if(rank >= this.maxrank) return "";
  var ld = leveldata[level];
  var val = this.val(level, rank);

  return "Unlocks " + Building.building_name(level, val);
};

var upgrades = [];
(function() {
	for(var i=0; i<leveldata[0].buildings.length; i++) {
		upgrades.push(new UpgIncome(i));
	}

	for(var i=0; i<upgrades.length; i++) {
		upgrades[i].idx = i;
	}
})();