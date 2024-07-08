/**
 * Created by Adam on 7/20/2015.
 */

var FeatTooltipView = React.createClass({
	render: function() {
		return React.createElement("div", null, this.props.feat.attr.desc());
	}
});

var FeatRowView = React.createClass({
	mixins: [TooltipMixin],
	render: function() {
		var complete = this.props.feat.condition();

		var attribs = {className: "feat-cont"};
		if(this.props.feat.condition())
			attribs.className += " completed";

		return React.createElement("div", attribs, this.props.feat.describe());
	},
	tooltipContent: function() {
		if(this.props.feat.attr)
			return React.createElement(FeatTooltipView, {feat: this.props.feat});
		else
			return null;
	}
});

var FeatEmbeddedView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "feats"},
			_.map(_.filter(achievements, function(ach, i) {
				if(i > 0) {
					var prev = achievements[i - 1];
					if(prev.level == ach.level && (!ach.bid || prev.bid == ach.bid)) {
						// Same level, same building
						return prev.condition();
					}
					if(ach.level > app.games.matter.live.max_level())
						return false;
				}
				return true;
			}), function(ach) {
				return React.createElement(FeatRowView, {feat: ach});
			})
		);
	}
});

var FeatView = React.createClass({
	render: function() {
		return React.createElement(FeatEmbeddedView);
	}
});
