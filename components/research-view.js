/**
 * Created by Adam on 7/20/2015.
 */

var ResearchCurrencyItemView = React.createClass({
	onClick: function() {
		dispatcher.sendEvent("res-curr-click", {level: this.props.level});
	},

	render: function() {
		return React.createElement("div", {onClick: this.onClick, className: "res-curr clicker button"},
			React.createElement(CurrencyView, {count: this.props.count, level: this.props.level, type:"research"})
		);
	}
});

var ResearchCurrencyListView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			_.map(_.range(this.props.max_level+1), function(level) {
				var count = app.games.matter.live.levels[level].currency();
				return React.createElement(ResearchCurrencyItemView, {count: count, level: level});
			})
		);
	}
});

var ResearchDescView = React.createClass({
	render: function() {
		return React.createElement("span", {dangerouslySetInnerHTML: {
			__html: this.props.research.desc(this.props.r.level, this.props.r.rank+this.props.r.offset, !this.props.r.offset)
		}});
	}
});

var ResearchListItemView = React.createClass({
	onClick: function() {
		dispatcher.sendEvent("research-attempt", {research: this.props.research});
	},

	render: function() {
		var cost = this.props.research.cost(this.props.r.level, this.props.r.rank+this.props.r.offset, true);

		var className = "clicker research-cont";
		if(this.props.currency >= cost[this.props.r.level])
			className += " affordable";
		else
			className += " unaffordable";

		return React.createElement("div", {className: className, onClick: this.onClick},
			React.createElement(ResearchDescView, {research: this.props.research, r: this.props.r}),
			React.createElement(CurrencyView, {className: "res-cost", level: this.props.r.level, count: cost[this.props.r.level], type: "research"})
		);
	}
});

var ResearchListView = React.createClass({
	render: function() {
		var self = this;
		return React.createElement("div", null,
			_.map(_.filter(researches, function(research) {
				var rank = researchrankobservable(research, self.props.level)();
				var ret = research.visible(self.props.level, rank);

				if(!ret) return false;

				return research.maxrank == 0 || rank < research.maxrank;
			}), function(research) {
				var rank = researchrankobservable(research, self.props.level)();
				return React.createElement(ResearchListItemView, {
					research: research,
					currency: self.props.currency,
					r: {
						level: self.props.level,
						rank: rank,
						offset: 1
					}
				});
			})
		);
	}
});

var ResearchEmbeddedView = React.createClass({
	render: function() {
		var currency = app.games.matter.live.levels[res_view_level()].currency();
		return React.createElement("div", null,
			React.createElement(ResearchCurrencyListView, {max_level: app.games.matter.live.max_level()}),
			React.createElement(ResearchListView, {level: res_view_level(), currency: currency})
		);
	}
});

var ResearchView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "research"}, "Research",
			React.createElement(ResearchEmbeddedView)
		);
	}
});
