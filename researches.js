function defcost(level, rank, display) {
	var ret = {};
	if(!display && debug_mode()) {
		ret[level] = 0;
		return ret;
	}

	if(rank < 10)
		ret[level] = (rank + 1) * 5;
	else
		ret[level] = Math.floor(10 * 5 * Math.pow(1.1, (rank - 9)));
	
	return ret;
}

function simplescale(rank, min, max) {
	if(rank < 0) return -1;

	if(rank < 5) return 5 * rank;

	var scaled = 25 + (max - 25 - min) * 2 / Math.PI * Math.atan((rank - 5) / 20);
	return scaled;
}

function deftotalcost(data) {
	var cost = {};
	for(var i=0; i<data.rank; i++) {
		var rankcost = defcost({level: data.level, rank:i}, false);
		
		for(var k in rankcost) {
			if(!cost.hasOwnProperty(k))
				cost[k] = 0;
			cost[k] += rankcost[k];
		}
	}
	
	return cost;
}

function defattrsadd(attrset, data) {
	var obj = this; data.attrvalid = attrset.addval(obj.type, 0, function() { return obj.val(data); }, false);
}

function defattrsdel(attrset, data) { 
	if(data && data.attrvalid !== undefined) 
		attrset.delval(this.type, 0, data.attrvalid); 
}

function defname(level, rank) {
	if(level < 0) return "N/A"; 
	if(this.names) return this.names[level][rank]; 
	else return ""; 
}

function defvis(level) { return this.meetsdeps(level); }

//Stored as - 0 : { "split" : { "level": 0, "rank" : 1}}

function ResDefault() {
	this.type = "none";
	this.idx = -1;
	this.maxrank = 0;
}
ResDefault.prototype.constructor = ResDefault;
ResDefault.prototype.val = function(data, curval) { return 0; };
ResDefault.prototype.cost = defcost;
ResDefault.prototype.totalcost = deftotalcost;
ResDefault.prototype.visible = defvis;
ResDefault.prototype.meetsdeps = function(level) { return true; };
ResDefault.prototype.name = defname;

function ResStarter() {
	ResDefault.call(this);
	
	this.type = "starter";
}
ResStarter.prototype = Object.create(ResDefault.prototype);
ResStarter.prototype.constructor = ResStarter;
ResStarter.prototype.val = function(level, rank) {
	if(rank < 0) return -1;

	return 200 * rank;
};
ResStarter.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	return ld.name.capitalize()+"s spawn with "+val+" (from "+val_prev+") "+currencyicon(level);
};

function ResCost() {
	ResDefault.call(this);
	this.type = "cost";
}
ResCost.prototype = Object.create(ResDefault.prototype);
ResCost.prototype.constructor = ResCost;
ResCost.prototype.val = function(level, rank) {
	return Math.floor(simplescale(rank, 0, 75) * 1000) / 1000;
};
ResCost.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	return ld.name.capitalize()+" buildings cost " + val + "% (from "+val_prev+"%) less";
};

function ResFlatInc() {
	ResDefault.call(this);
	this.type = "flatinc";
}
ResFlatInc.prototype = Object.create(ResDefault.prototype);
ResFlatInc.prototype.constructor = ResFlatInc;
ResFlatInc.prototype.cost = function(level, rank, display) {
	var ret = {};
	if(!display && debug_mode()) {
		ret[level] = 0;
		return ret;
	}

	ret[level] = (Math.floor(rank / 4) + 1) * 5;

	if(rank > 5)
		ret[level] *= Math.pow(1.1, rank - 5);
	ret[level] = Math.floor(ret[level]);

	return ret;
};
ResFlatInc.prototype.val = function(level, rank) { if(rank < 0) return -1; if(rank==0) return 0; return 5 * rank + (rank-1)*(rank-1); };
ResFlatInc.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	return ld.name.capitalize()+" gain " + val + " "+currencyicon(level)+" / sec (from "+val_prev+")";
};

function ResExpIgnore() {
	ResDefault.call(this);
	this.type = "expign";
}
ResExpIgnore.prototype = Object.create(ResDefault.prototype);
ResExpIgnore.prototype.constructor = ResExpIgnore;
ResExpIgnore.prototype.val = function(level, rank) {
	if(rank < 0) return -1;

	if(rank < 5)
		return 3 * rank;

	if(rank < 30)
		return 3*4 + 2 * (rank - 4);

	return 3 * 4 + 2 * 25 + 1 * (rank - 29);
};
ResExpIgnore.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	return ld.name.capitalize()+" ignore " + val + " (from " + val_prev + ") buildings for cost";
};

function ResUpgSpd() {
  ResDefault.call(this);
  this.type = "upgspd";
}
ResUpgSpd.prototype = Object.create(ResDefault.prototype);
ResUpgSpd.prototype.constructor = ResUpgSpd;
ResUpgSpd.prototype.val = function(level, rank) {
	if(rank < 0) return -1;
	if(rank == 0) return 0;
	return (5 * rank + 10);
};
ResUpgSpd.prototype.desc = function(level, rank) {
  var ld = leveldata[level];
  var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
  return ld.name.capitalize()+"s generate upgrade points "+val+"% (from "+val_prev+") faster";
};

function ResNumActive() {
	ResDefault.call(this);

	this.type = "numactive";
	this.maxrank = 5;
}
ResNumActive.prototype = Object.create(ResDefault.prototype);
ResNumActive.prototype.constructor = ResNumActive;
ResNumActive.prototype.cost = function(level, rank, display) {
	var ret = {};
	if(!display && debug_mode()) {
		ret[level] = 0;
		return ret;
	}

	ret[level] = [25, 100, 200, 300, 500][rank - 1];

	return ret;
};
ResNumActive.prototype.val = function(level, rank) { if(rank < 0) return -1; return rank+1; };
ResNumActive.prototype.visible = function(level) { return level === 0; };
ResNumActive.prototype.desc = function(level, rank, completed) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);

	if(!completed)
		return "You can have "+val+" (from "+val_prev+") "+ld.name.capitalize()+"s active at once";
	else
		return "You can have "+val+" "+ld.name.capitalize()+"s active at once";
};

function ResCompleteCount() {
	ResDefault.call(this);

	this.type = "locrequired";
	this.maxrank = 5;
}
ResCompleteCount.prototype = Object.create(ResDefault.prototype);
ResCompleteCount.prototype.constructor = ResCompleteCount;
ResCompleteCount.prototype.val = function(level, rank) { if(rank < 0) return -1; return 6 - rank; };
ResCompleteCount.prototype.cost = function(level, rank, display) {
	var ret = {};
	if(!display && debug_mode()) {
		ret[level] = 0;
		return ret;
	}

	ret[level] = [10000, 20000, 50000, 100000, 200000, 500000][rank - 1];

	return ret;
};
ResCompleteCount.prototype.desc = function(level, rank, complete) {
	if(level == 0) return "";
	var ld = leveldata[level];
	var ld1 = leveldata[level - 1];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	if(!complete)
		return ld.name.capitalize()+"s are founded after "+val+" "+ld1.name.capitalize()+" (from "+val_prev+")";
	else
		return ld.name.capitalize()+"s are founded after "+val+" "+ld1.name.capitalize();
};
ResCompleteCount.prototype.visible = function(level) {
	return level > 0;
};

function ResAutobuy(bid) {
	ResDefault.call(this);

	this.type = "autobuy";
	this.bid = bid;
}
ResAutobuy.prototype = Object.create(ResDefault.prototype);
ResAutobuy.prototype.constructor = ResAutobuy;
ResAutobuy.prototype.val = function(level, rank) {
	if(rank < 0) return -1;

	return Math.pow((this.bid+1),2) * rank;
};
ResAutobuy.prototype.cost = function(level, rank, display) {
	var ret = {};
	if(!display && debug_mode()) {
		ret[level] = 0;
		return ret;
	}

	ret[level] = 10 * (rank + 1);

	if(rank > 9)
		ret[level] *= Math.pow(1.1, rank - 10);
	ret[level] = Math.floor(ret[level]);

	return ret;
};
ResAutobuy.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);

	return "Reserves "+val+currencyicon(level)+" / sec (from " + val_prev + ") to buy " + ld.buildings[this.bid].name.capitalize();
};
ResAutobuy.prototype.visible = function(level) {
	if(this.bid == 0) return true;
	// If we've already somehow bought one (old saves)
	if(game.levels[level].buildings[this.bid].ranks[this.type]() > 0) return true;
	// Require purchasing at least one of the previous level
	return game.levels[level].buildings[this.bid - 1].ranks[this.type]() > 0;
};

function ResAutoPct(bid) {
	ResDefault.call(this);

	this.type = "autopct";
	this.bid = bid;
}
ResAutoPct.prototype = Object.create(ResDefault.prototype);
ResAutoPct.prototype.constructor = ResAutoPct;
ResAutoPct.prototype.val = function(level, rank) {
	if(rank < 0) return -1;

	return Math.floor((250 - simplescale(rank, 0, 150)) * 1000) / 1000;
};
ResAutoPct.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	return "Autobuy "+ld.buildings[this.bid].name.capitalize()+" cost "+val+"% (from "+val_prev+")";
};
ResAutoPct.prototype.visible = function(level) {
	if(game.levels[level].buildings[this.bid].ranks[this.type]() > 0) return true;
	return game.levels[level].buildings[this.bid].ranks["autobuy"]() > 0;
};

function ResAutoComplete() {
	ResDefault.call(this);

	this.type = "autocomplete";
}
ResAutoComplete.prototype = Object.create(ResDefault.prototype);
ResAutoComplete.prototype.constructor = ResAutoComplete;
ResAutoComplete.prototype.val = function(level, rank) {
	if(rank <= 0) return -1;

	return Math.floor((125 - simplescale(rank, 0, 120)) * 1000) / 1000;
};
ResAutoComplete.prototype.desc = function(level, rank) {
	var ld = leveldata[level];
	var val = this.val(level, rank);
	var val_prev = this.val(level, rank - 1);
	if(val_prev < 0) val_prev = "never";
	return "Auto-completes "+ld.name.capitalize()+"s after "+val+" (from "+val_prev+") seconds";
};
ResAutoComplete.prototype.visible = function(level) {
	if(game.levels[level].ranks[this.type]() > 0) return true;
	return game.levels[level].buildings[0].ranks["autobuy"]() > 0;
};


researches = [];
(function() {
	researches.push(new ResNumActive());
	researches.push(new ResCompleteCount());
	researches.push(new ResFlatInc());
	researches.push(new ResCost());
	researches.push(new ResStarter());
	researches.push(new ResExpIgnore());
	researches.push(new ResUpgSpd());
	researches.push(new ResAutoComplete());

	for(var bid=0; bid<10; bid++) {
		researches.push(new ResAutobuy(bid));
		researches.push(new ResAutoPct(bid));
	}

	for(var i=0; i<researches.length; i++) {
		researches[i].idx = i;
	}
})();

function researchcost(resdata) {
	return researches[resdata.name].cost(resdata);
}

function researchval(resdata, rank) {
	if(rank === undefined) level = resdata.rank;
	
	return researches[resdata.name].val(resdata.level, rank);
}