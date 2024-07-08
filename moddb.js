
function ModDB(name) {
	this.name = name;
	this.total_weight = 0;
	this.group_weights = {};
	this.mod_list = [];
}
ModDB.prototype.constructor = ModDB;
ModDB.prototype.add = function(mod) {
	this.mod_list.push(mod);
	this.total_weight += mod.weight;
	this.group_weights[mod.group] += mod.weight;
};
ModDB.prototype.get = function(exclude) {
	var weight = this.total_weight;
	if(exclude) {
		for(var i=0; i<exclude.length; i++)
			weight -= this.group_weights[exclude[i]];
	}
	var rand = Math.random() * this.total_weight;

	for(var i=0; i < this.mod_list.length; i++) {
		var mod = this.mod_list[i];
		if(exclude && exclude.contains(mod.group)) continue;

		rand -= this.mod_list[i].weight;
		if(rand <= 0) return mod;
	}
	return null;
};

var govModDB = new ModDB("gov");
(function() {
	// Building attributes
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("synergyall"+i, "synergyall", i + 1, [new AttrDef("synergy", [new RandomComponentBuilding("bid"), new RandomComponentRange("val", i*3 + 1, (i+1) * 3)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("synergy"+i, "synergy", i + 1, [new AttrDef("synergy", [new RandomComponentBuilding("bid"), new RandomComponentBuilding("bid2"), new RandomComponentRange("val", i*3 + 1, (i+1) * 3)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("build_inc"+i, "build_inc", i + 1, [new AttrDef("income", [new RandomComponentBuilding("bid"), new RandomComponentRange("val", i*10 + 1, (i+1) * 10)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("build_cost"+i, "build_cost", i + 1, [new AttrDef("cost", [new RandomComponentBuilding("bid"), new RandomComponentRange("val", i*10 + 1, (i+1) * 10)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("build_pct"+i, "build_pct", i + 1, [new AttrDef("autopct", [new RandomComponentBuilding("bid"), new RandomComponentRange("val", i*5 + 1, (i+1) * 5)])])); }

	// Loc attributes
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("tourism"+i, "tourism", i + 1, [new AttrDef("baseincome", [new RandomComponentRange("val", i*10 + 1, (i+1) * 10)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("healthy"+i, "healthy", i + 1, [new AttrDef("cost", [new RandomComponentRange("val", i*3 + 1, (i+1) * 3)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("optimizer"+i, "optimizer", i + 1, [new AttrDef("fasterupgrades", [new RandomComponentRange("val", i*3 + 1, (i+1) * 3)])])); }
	for(var i=0; i<5; i++) { govModDB.add(new ModDef("builder"+i, "builder", i + 1, [new AttrDef("baseincome", [new RandomComponentRange("val", i*3 + 1, (i+1) * 3)]),
																																									 new AttrDef("autobuy", [new RandomComponentBuilding("bid"), new RandomComponentRange("val", i*3 + 1, i*3 + 1)])])); }
})();

