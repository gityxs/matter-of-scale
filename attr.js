/** @class **/
function Attr(type, components) {
	this.id = attr_ids++;
	this.components = {};

	if(!type) return; // For loading

	this.type = type;
	for(var i=0; i<components.length; i++) {
		var c = components[i];
		this.components[c.name] = c;
	}
}
Attr.prototype.constructor = Attr;
Attr.prototype.save = function() {
	var saved = {};

	saved.type = this.type;
	saved.components = [];
	for(var k in this.components) {
		if(!this.components.hasOwnProperty(k)) continue;

		var c = this.components[k];
		saved.components.push(c);
	}

	return saved;
};
Attr.prototype.load = function(saved) {
	this.type = saved.type;
	for(var i=0; i<saved.components.length; i++) {
		var c = saved.components[i];
		this.components[c.name] = c;
	}
};
Attr.prototype.get = function(compname) {
	return this.components[compname];
};
Attr.prototype.desc = function() {
	switch(this.type) {
		case "income":
			if(this.components.bid) {
				return "Increases income of tier "+(this.components.bid.bid+1) +" by " + this.components.val.val + "%";
			} else {
				return "Increases income by " + this.components.val.val + "% for each level of " + this.components.val;
			}
		case "synergy":
			if(this.components.bid2) {
				return "Increases income of tier " + (this.components.bid.bid+1) + " by " + this.components.val.val + "% for each building of tier " + (this.components.bid2.bid + 1);
			} else {
				return "Increases income of tier " + (this.components.bid.bid+1) + " by " + this.components.val.val + "% for each building";
			}
		case "baseincome":
			return "Grants base income of " + this.components.val.val;
		case "cost":
			if(this.components.bid) {
				return "Decreases cost of tier "+(this.components.bid.bid+1)+" by " + this.components.val.val + "%";
			} else {
				return "Decreases cost of buildings by " + this.components.val.val + "%";
			}
		case "fasterupgrades":
			return "Increases upgrade point generation by " + this.components.val.val + "%";
		case "autobuy":
			return "Reserves "+this.components.val.val+" income to purchase tier "+(this.components.bid.bid+1)+" buildings";
		case "autopct":
			return "Reduces autobuy surchage of tier "+(this.components.bid.bid+1)+" buildings by "+this.components.val.val+"%";
		case "time_curr_rate":
			return "Increases rate of Vote events by "+this.components.val.val+"%";
		case "time_curr_dur":
			return "Increases duration of Vote events by "+this.components.val.val+"%";
		case "prestige_rate":
			return "Increases rate of Prestige events by "+this.components.val.val+"%";
		case "prestige_dur":
			return "Increases duration of Prestige events by "+this.components.val.val+"%";
		case "upgrade_rate":
			return "Increases rate of Upgrade events by "+this.components.val.val+"%";
		case "upgrade_dur":
			return "Increases duration of Upgrade events by "+this.components.val.val+"%";
	}
	return "unknown";
};


function AttrDef(type, components) {
	this.type = type;
	this.components = components;
}
AttrDef.prototype.constructor = AttrDef;
AttrDef.prototype.instantiate = function() {
	var components = [];
	for(var i=0; i<this.components.length; i++) {
		components.push(this.components[i].execute());
	}
	return new Attr(this.type, components);
};
