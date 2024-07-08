/**
 * Created by Adam on 7/20/2015.
 */

var PlaceImageView = React.createClass({
	render: function() {
		return React.createElement("img", {src: "/img/level"+this.props.level+"place.png"});
	}
});

var PlaceTitleView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "place-title"},
			React.createElement(PlaceImageView, {level: this.props.level}),
			React.createElement("span", {className: "place-name"}, this.props.name),
			React.createElement(CurrencyView, {count: this.props.votes, type: "time"})
		);
	}
});

var PlaceGoalsView = React.createClass({
	render: function() {
		return React.createElement("div", null, this.props.complete + "% - " + this.props.goals[0].desc());
	}
});

var PlaceIncomeView = React.createClass({
	render: function() {
		return React.createElement("span", null,
			React.createElement(CurrencyView, {level: this.props.level, count: this.props.income, type: "currency"}),
			React.createElement("span", null, " / sec")
		);
	}
});

var PlaceBankView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "place-bank"},
			React.createElement(CurrencyView, {level: this.props.level, count: this.props.currency, type: "currency"}),
			React.createElement(PlaceIncomeView, {level: this.props.level, income: this.props.income}),
			React.createElement(CurrencyView, {count: this.props.upgrade_points, type: "upgrade"})
		);
	}
});

var BuildingView = React.createClass({
	onMouseDown: function() {
		dispatcher.sendEvent("buy-start", {pid: this.props.pid, bid: this.props.bid});
	},

	render: function() {
		return React.createElement("div", {className: "building-name clicker", onMouseDown: this.onMouseDown}, this.props.name);
	}
});

var BuildingAutobuyView = React.createClass({
	render: function() {
		if(this.props.autobuy <= 0)
			return React.createElement("div", {style: {visibility: "none"}});
		else {
			return React.createElement(TimerView, {value: this.props.autobuy, total: this.props.total, type: "building", tooltip: true});
		}
	}
});

var PlaceBuildingRowView = React.createClass({
	render: function() {
		var className = "building-cont";
		var cost = this.props.building.cost();
		if(this.props.currency >= cost)
			className += " affordable";
		else
			className += " unaffordable";
		return React.createElement("div", {className: className},
			React.createElement(BuildingView, {name: this.props.bdata.name, bid: this.props.building.bid, pid: this.props.building.place.id}),
			React.createElement("div", {className: "building-count"}, this.props.building.count()),
			React.createElement("div", {className: "building-cost"}, cost),
			React.createElement("div", {className: "building-income"}, this.props.building.income())
		);
	}
});

var PlaceBuildingListView = React.createClass({
	render: function() {
		var place = this.props.place;
		var ldata = leveldata[place.level];
		var headers = ["Building", "Count", "Cost", "Income"];
		var classes = ["name", "count", "cost", "inc"];
		return React.createElement("div", null,
			React.createElement("div", null,
				_.map(headers, function(header, i) {
					return React.createElement("span", {className: "head-"+classes[i]}, header);
				})
			),
			React.createElement("div", null,
				_.map(ldata.buildings, function(building, i) {
					var mult = game.levels[view_level()].buildings[i].attrs.autopct() / 100;
					if(mult == 0) mult = 2.5;
					var cost = place.buildings[i].cost();
					return React.createElement("div", null,
						React.createElement(PlaceBuildingRowView, {bdata: building, building: place.buildings[i], currency: place.currency()}),
						React.createElement(BuildingAutobuyView, {autobuy: place.buildings[i].autobuy(), total: mult * cost}))
				})
			)
		);
	}
});

var TimerView = React.createClass({
	mixins: [TooltipMixin],

	render: function() {
		var width = (this.props.value / this.props.total * 100) + "%";
		return React.createElement("div", {className: "timer-cont"},
			React.createElement("div", {className: "timer "+this.props.type, style: {width: width}})
		);
	},

	tooltipContent: function() {
		if(!this.props.tooltip)
			return null;
		var value = Math.floor(this.props.value);
		var total = Math.floor(this.props.total);
		var pct = Math.floor(this.props.value / this.props.total * 100);
		return React.createElement("div", null, value + " of " + total + " Stored ("+ pct + "%)");
	}
});

var PlaceAutobuyView = React.createClass({
	onClick: function() {
		dispatcher.sendEvent("autobuy-click");
	},

	render: function() {
		if(!this.props.autobuy) {
			return React.createElement("div", {style: { display: "hidden"}});
		} else {
			return React.createElement("div", {className: "clicker button", onClick: this.onClick},
				React.createElement("input", {type: "checkbox", checked: this.props.checked}),
				"Autobuy"
			);
		}
	}
});

var PlaceAutoCompleteView = React.createClass({
	onClick: function() {
		dispatcher.sendEvent("autocomplete-click");
	},

	render: function() {
		if(!this.props.autocomplete) {
			return React.createElement("div", {style: { display: "hidden"}});
		} else {
			return React.createElement("div", {className: "clicker button", onClick: this.onClick},
				React.createElement("input", {type: "checkbox", checked: this.props.checked}),
				"Autocomplete"
			);
		}
	}
});

var PlaceCompletedView = React.createClass({
	onClick: function() {
		if(this.props.completed < 100) return;

		dispatcher.sendEvent("complete-attempt", {pid: this.props.pid});
	},

	render: function() {
		if(this.props.completed < 100) {
			return React.createElement("div", {style: { visibility: "none"}});
		} else {
			if(this.props.auto_complete <= 0)
				return React.createElement("div", {className: "clicker button", onClick: this.onClick}, "Complete");
			else
				return React.createElement("div", {className: "clicker button", onClick: this.onClick},
					"Complete",
					React.createElement(TimerView, {value: this.props.auto_complete, total: 100, type: "complete"})
				);
		}
	}
});

var PlaceView = React.createClass({
	render: function() {
		var place = this.props.place;
		var votes = app.games.matter.live.time_currency();
		var upgrade_points = app.games.matter.live.levels[place.level].upgradepts();
		return React.createElement("div", {className: "place"},
			React.createElement(PlaceTitleView, {level: place.level, name: place.name(), votes: votes}),
			React.createElement(PlaceCompletedView, {completed: place.completed(), pid: place.id, auto_complete: place.autocomplete()}),
			React.createElement(PlaceAutoCompleteView, {autocomplete: place.autocomplete() > 0, checked: place.autocomplete_enabled()}),
			React.createElement(PlaceAutobuyView, {autobuy: place.autobuy_owned(), checked: place.autobuy_enabled()}),
			React.createElement(PlaceGoalsView, {goals: place.goals(), complete: place.completed()}),
			React.createElement(PlaceBankView, {level: place.level, currency: place.currency(), income: place.income(), upgrade_points: upgrade_points}),
			React.createElement(PlaceBuildingListView, {place: this.props.place})
		)
	}
});