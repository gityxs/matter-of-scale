

function Component(name) {
	this.name = name;

	this.type = "default";
}
Component.prototype.constructor = Component;

function ComponentVal(name, val) {
	Component.call(this, name);

	this.val = val;
}
ComponentVal.prototype = Object.create(Component.prototype);
ComponentVal.prototype.constructor = ComponentVal;

function RandomComponent(name) {
	this.name = name;
}
RandomComponent.prototype.constructor = RandomComponent;

function RandomComponentRange(name, min, max) {
	RandomComponent.call(this, name);
	this.min = min;
	this.max = max;
}
RandomComponentRange.prototype = Object.create(RandomComponent.prototype);
RandomComponentRange.prototype.constructor = RandomComponentRange;
RandomComponentRange.prototype.execute = function() {
	var val = rand(this.min, this.max);
	return new ComponentVal(this.name, val);
};

function RandomComponentBuilding(name) {
	RandomComponent.call(this, name);
}
RandomComponentBuilding.prototype = Object.create(RandomComponent.prototype);
RandomComponentBuilding.prototype.constructor = RandomComponentBuilding;
RandomComponentBuilding.prototype.execute = function() {
	var bid = rand(0, 5);
	return {"name": this.name, "bid": bid};
};

function RandomComponentList(name, list) {
	RandomComponent.call(this, name);

	this.list = list;
}
RandomComponentList.prototype = Object.create(RandomComponent.prototype);
RandomComponentList.prototype.constructor = RandomComponentList;
RandomComponentList.prototype.execute = function() {
	var idx = randomarrayidx(this.list);
	return {"name": this.name, "elem": idx, "obj": this.list[idx]};
};
