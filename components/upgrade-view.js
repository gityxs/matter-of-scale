/**
 * Created by Adam on 7/20/2015.
 */

var UpgradeRowView = React.createClass({
	onClick: function() {
		dispatcher.sendEvent("upgrade-attempt", {upgrade: this.props.upgrade});
	},

	render: function() {
		var desc = this.props.upgrade.desc(this.props.level, this.props.rank);
		var cost = this.props.upgrade.cost(this.props.level, this.props.rank + 1, true);

		var className = "clicker research-cont";
		if(this.props.currency >= cost)
			className += " affordable";
		else
			className += " unaffordable";

		return React.createElement("div", {className: className, onClick: this.onClick},
			React.createElement("span", null, desc),
			React.createElement(CurrencyView, {className: "res-cost", count: cost, type: "upgrade"})
		);
	}
});

var UpgradeListView = React.createClass({
	render: function() {
		var place = view_place();
		var self = this;
		return React.createElement("div", null,
			_.map(_.filter(upgrades, function(upgrade) {
				if(upgrade.bid) {
					if(place.buildings[upgrade.bid].count() <= 0)
						return false;
				}

				return upgrade.visible(place.level);
			}), function(upgrade) {
				var rank = place.upgrade_rank(upgrade);
				return React.createElement(UpgradeRowView, {upgrade: upgrade, level: place.level, rank: rank(), currency: self.props.currency});
			})
		);
	}
});

var UpgradeView = React.createClass({
	render: function() {
		var currency = app.games.matter.live.levels[view_level()].upgradepts();
		return React.createElement("div", {className: "upgrades"}, "Upgrades",
			React.createElement(UpgradeListView, {currency: currency}));
	}
});
