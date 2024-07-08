/**
 * Created by Adam on 6/14/2015.
 */

var HierarchyLevelNameView = React.createClass({
	render: function() {
		if(this.props.remaining == null)
			return React.createElement("div", {"className": "hierarchy_name"}, this.props.name.capitalize());
		else
			return React.createElement("div", {"className": "hierarchy_name"}, this.props.name.capitalize() + " (Next in "+this.props.remaining+")");
	}
});

var HierarchyLevelView = React.createClass({
	render: function() {
		var data = leveldata[this.props.level];
		var level = app.games.matter.live.levels[this.props.level];
		var remaining = null;
		if(this.props.level + 1 < leveldata.length)
			remaining = app.games.matter.live.levels[this.props.level + 1].remaining();
		return React.createElement("div", {"className": "hierarchy_level"},
			React.createElement(HierarchyLevelNameView, {name: data.name, remaining: remaining}),
			React.createElement("div", {className: "hierarchy_cont"},
				level.places().map(function(place) {
					return React.createElement(HierarchyLocationView, {place: place});
				}))
		);
	}
});
