/**
 * Created by Adam on 6/14/2015.
 */

function Dispatcher() {
	this.listenersByEvent = {};
	this.listeners = {};
	this.listener_id = 0;
}
Dispatcher.prototype.constructor = Dispatcher;
Dispatcher.prototype.sendEvent = function(name, data) {
	var listeners = this.listenersByEvent[name];

	if(!listeners)
		return;

	var self = this;
	_.each(listeners, function(ignore, id) {
		self.listeners[id].call(data);
	});
};
Dispatcher.prototype.register = function(name, func) {
	if(!this.listenersByEvent[name])
		this.listenersByEvent[name] = {};

	var listener = new Listener(this.listener_id, name, func);
	this.listener_id++;
	this.listenersByEvent[name][listener.id] = true;
	this.listeners[listener.id] = listener;

	return listener.id;
};
Dispatcher.prototype.unregister = function(id) {
	var listener = this.listeners[id];
	delete this.listeners[id];

	delete this.listenersByEvent[listener.name][id];
};
