
/** @class **/
function Mod() {
	/** @member {Array.<Attr>} attrs **/
	this.attrs = [];
	if(arguments.length === 2) {
		this.name = arguments[0];
		this.attrs = arguments[1];
	} else if(arguments.length === 1) {
		this.name = arguments[0].name;
		this.attrs = arguments[0].attrs;
	}
}
Mod.prototype.constructor = Mod;
Mod.prototype.describe = function() {
	return "" + this.attr + " = " + this.val;
};
Mod.prototype.save = function() {
	var saved = {};

	saved.name = this.name;
	saved.attrs = [];
	for(var i=0; i<this.attrs.length; i++) {
		saved.attrs.push(this.attrs[i].save());
	}

	return saved;
};
Mod.prototype.load = function(saved) {
	this.name = saved.name;
	this.attrs = [];
	for(var i=0; i<saved.attrs.length; i++) {
		this.attrs.push(new Attr());
		this.attrs[i].load(saved.attrs[i]);
	}
};

function ModDef(name, group, rarity, attrdefs) {
	this.name = name;
	this.group = group;
	this.rarity = rarity;
	this.attrdefs = attrdefs;
	this.weight = 1 / this.rarity;
}
ModDef.prototype.constructor = ModDef;
ModDef.prototype.instantiate = function() {
	var attrs = [];
	for(var i=0; i<this.attrdefs.length; i++) {
		attrs.push(this.attrdefs[i].instantiate());
	}

	return new Mod(this.name, attrs);
};
