/**
 * Created by Adam on 6/14/2015.
 */

var HierarchyLocationView = React.createClass({
	mixins: [TooltipMixin],
	get_img_src: function(place) {
		return "../../img/level"+place.level+"place.png";
	},

	onClick: function() {
		dispatcher.sendEvent("loc-click", {place: this.props.place});
	},

	render: function() {
		var completed = Math.floor(this.props.place.completed());
		var className = "place-cont";
		if(completed >= 100)
			className += " completed";
		return React.createElement("div", {onClick: this.onClick, className: className},
			React.createElement("img", {"src": this.get_img_src(this.props.place)}),
			React.createElement("br"),
			React.createElement("span", null, completed+"%")
		);
	},

	tooltipContent: function() {
		return React.createElement("div", null, this.props.place.name());
	}
});
