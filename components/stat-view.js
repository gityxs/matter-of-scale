/**
 * Created by Adam on 7/20/2015.
 */

var StatResourceView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "stat-cont"},
			React.createElement("span", null, "Total"),
			React.createElement(CurrencyView, {level: this.props.level, type: "currency", count: this.props.value})
		);
	}
});

var StatLineView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "stat-cont"},
			React.createElement("span", null, this.props.stat),
			React.createElement("span", null, Math.floor(this.props.value))
		);
	}
});

var StatEmbeddedView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(StatLineView, {stat: "Time since Founding", format: "date", value: app.games.matter.live.stats.found_time()}),
			React.createElement(StatLineView, {stat: "Active Time", format: "date", value: app.games.matter.live.stats.play_time()}),
			React.createElement(StatLineView, {stat: "Offline Time", format: "date", value: app.games.matter.live.stats.idle_time()}),
			React.createElement(StatLineView, {stat: "Total Income", format: "date", value: app.games.matter.live.stats.total()}),
			React.createElement(StatLineView, {stat: "Votes Clicked", format: "date", value: app.games.matter.live.stats.actives.time_curr()}),
			React.createElement("div", null,
				_.map(_.range(0, app.games.matter.live.max_level()+1), function(level) {
					return React.createElement(StatResourceView, {level: level, value: app.games.matter.live.stats.levels[level].income()})
				})
			)
		);
	}
});

var StatView = React.createClass({
	render: function() {
		return React.createElement(StatEmbeddedView);
	}
});