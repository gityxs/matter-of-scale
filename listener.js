/**
 * Created by Adam on 6/14/2015.
 */

function Listener(id, name, func) {
	this.id = id;
	this.name = name;
	this.func = func;
}
Listener.prototype.constructor = Listener;
Listener.prototype.call = function(data) {
	this.func(data);
};
