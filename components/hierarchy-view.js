/**
 * Created by Adam on 6/14/2015.
 */

var HierarchyHelpers = {
	view: function(state) {
		// Traverse and create tree
		return React.createElement(HierarchyView, {max_level: game.max_level()});
	}
};

var HierarchyView = React.createClass({
	render: function() {
		var levels_args = ["div", {"id": "hierarchy", className: "poptree"}];

		for(var i=leveldata.length - 1; i>=0; i--) {
			if(i <= this.props.max_level) {
				levels_args.push(React.createElement(HierarchyLevelView, {level:i}));
			}
		}

		return React.createElement.apply(React, levels_args);
	}
});
