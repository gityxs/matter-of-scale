/**
 * Created by Adam on 7/20/2015.
 */

var optionButtons = [
	{key: "mute"},
	{key: "pause"},
	{key: "reset"},
	{key: "save"},
	{key: "export"},
	{key: "import"},
	{key: "patchnotes"},
	{key: "debug"}
];

var OptionButtonView = React.createClass({
	onClick: function() {
		dispatcher.sendEvent("click-"+this.props.button.key, null);
	},

	getDesc: function() {
		return translator.get("options."+this.props.button.key + ".desc")();
	},

	getText: function() {
		return translator.get("options."+this.props.button.key + ".text")();
	},

	render: function() {
		var desc = this.getDesc();

		if(desc) {
			return React.createElement("div", null,
				React.createElement("span", {className: "button option clicker", onClick: this.onClick}, this.getText()),
				React.createElement("span", null, desc)
			);
		} else {
			return React.createElement("div", null,
				React.createElement("span", {className: "button option clicker", onClick: this.onClick}, this.getText())
			);
		}
	}
});

var OptionEmbeddedView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "options"},
			_.map(_.filter(optionButtons, function(button) {
				if(button.key == "debug" && window.location.href.indexOf("localhost") < 0 ) {
					return false;
				}
				return true;
			}), function(button) {
				return React.createElement(OptionButtonView, {button: button})
			})
		);
	}
});

var OptionView = React.createClass({
	render: function() {
		return React.createElement(OptionEmbeddedView);
	}
});