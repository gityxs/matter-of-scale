/**
 * Created by Adam on 7/20/2015.
 */

var AppView = React.createClass({
	getInitialProps: function() {
		return {};
	},

	getInitialState: function() {
		return {
			selected: 1
		};
	},

	onAfterChange: function(selectedIndex, $selectedPanel, $selectedTabMenu) {
		this.state.selected = selectedIndex;
	},

	render: function() {
		if(!app || !app.games || !this.props)
			return React.createElement("div"); // Return empty element to appease React

		var game = app.games[this.props.game][this.props.env];
		var widthLeft = document.documentElement.clientWidth;
		var contents = ["div", null];
		var content;

		var i; var tab;
		for(i=0; i<game.tabs.length; i++) {
			tab = game.tabs[i];

			if(!tab.enabled)
				continue;

			var lastTab = i == game.tabs.length - 1;
			if(lastTab || tab.width + game.tabsWidth + 5 < widthLeft) {
				if(tab.content) {
					contents.push(tab.content(this.props));
				} else if(tab.element) {
					contents.push(React.createElement(tab.element));
				}
			}
			else
				break;

			widthLeft -= tab.width;
		}

		if(i < game.tabs.length) {
			var tab_args = [ReactSimpleTabs, {"tabActive": this.state.selected, "onAfterChange": this.onAfterChange}];
			for(; i<game.tabs.length; i++) {
				tab = game.tabs[i];

				if(!tab.enabled) continue;

				if(tab.content) {
					tab_args.push(React.createElement(ReactSimpleTabs.Panel, {title:tab.title}, tab.content(this.props)));
				} else if(tab.element) {
					tab_args.push(React.createElement(ReactSimpleTabs.Panel, {title:tab.title},
						React.createElement(tab.element))
					);
				}
			}
			contents.push(React.createElement.apply(React, tab_args));
		}

		return React.createElement.apply(React, contents);
	}
});
