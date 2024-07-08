/**
 * Created by Adam on 8/20/2015.
 */

var UpgradeImageView = React.createClass({
	render: function() {
		return React.createElement("img", {src: "/img/upgrade_icon.png"});
	}
});

var IncomeImageView = React.createClass({
	render: function() {
		return React.createElement("img", {src: "/img/level"+this.props.level+"curr.png"});
	}
});

var PrestigeImageView = React.createClass({
	render: function() {
		return React.createElement("img", {src: "/img/level"+this.props.level+"pres.png"});
	}
});

var TimeImageView = React.createClass({
	render: function() {
		return React.createElement("img", {src: "/img/time_currency.png"});
	}
});

var CurrencyImageView = React.createClass({
	render: function() {
		var element = {
			"upgrade": UpgradeImageView,
			"research": PrestigeImageView,
			"currency": IncomeImageView,
			"time": TimeImageView
		}[this.props.type];
		return React.createElement(element, {level: this.props.level});
	}
});

var CurrencyView = React.createClass({
	render: function() {
		var attribs = {className: "currency"};
		if(this.props.className)
			attribs.className += " " + this.props.className;
		return React.createElement("span", attribs,
			React.createElement("span", {className:"currency-count"}, Math.floor(this.props.count)),
			React.createElement(CurrencyImageView, {type: this.props.type, level: this.props.level})
		);
	}
});