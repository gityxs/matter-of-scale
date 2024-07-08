/**
 * Created by Adam on 7/20/2015.
 */

var TwitterSubscribeView = React.createClass({
	render: function() {
		return React.createElement("div", null, "Follow on Twitter");
	}
});

var RedditCount = React.createClass({
	getInitialState: function() {
		return { count: 0 }
	},

	onAjax: function(data, status) {
		this.state.count = data.responseJSON.data.subscribers;
	},

	componentWillMount: function() {
		$.ajax("//www.reddit.com/r/MatterOfScale/about.json", {dataType: "json", complete: this.onAjax});
	},

	render: function() {
		return React.createElement("div", null, this.state.count);
	}
});

var RedditSubscribeView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement("a", {href: "//reddit.com/r/MatterOfScale", target: "_blank"}, "Follow on Reddit"),
			React.createElement(RedditCount)
		);
	}
});

var SocialSubscribeView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(RedditSubscribeView),
			React.createElement(TwitterSubscribeView)
		);
	}
});

var SocialDonateBitcoinView = React.createClass({
	render: function() {
		return React.createElement("a", {href: "bitcoin:12uKhzFUYmD5MQ9AHSjjzstFENeSifZm2b", className: "social-donate"}, "Donate BTC");
	}
});

var SocialDonateCreditView = React.createClass({
	render: function() {
		return React.createElement("a", {href: "https://donorbox.org/astarsearcher-matter-of-scale", className: "social-donate", target: "_blank"}, "Donate CC");
	}
});

var SocialDonatePatreonView = React.createClass({
	getInitialState: function() {
		return { count: null }
	},

	onAjax: function(data, status) {
		//this.state.count = data.responseJSON.data.pledge_sum + 12;
	},

	componentWillMount: function() {
		//$.ajax("http://api.patreon.com/campaigns/120251?api_key=1745177328c8a1d48100a9b14a1d38c1", {dataType: "json", complete: this.onAjax});
	},

	render: function() {
		return React.createElement("a", {href: "//www.patreon.com/bePatron?patAmt=1&u=355822", className: "social-donate", target: "_blank"}, "Donate Patreon", this.state.count);
	}
});

var SocialDonateView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(SocialDonateBitcoinView),
			React.createElement(SocialDonateCreditView),
			React.createElement(SocialDonatePatreonView)
		);
	}
});

var RedditShareView = React.createClass({
	render: function() {
		return React.createElement("div", null, "Share on Reddit");
	}
});

var PinterestShareView = React.createClass({
	render: function() {
		return React.createElement("div", null, "Share on Pinterest");
	}
});

var FacebookShareView = React.createClass({
	render: function() {
		return React.createElement("div", null, "Share on Facebook");
	}
});

var SocialSharingView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(FacebookShareView),
			React.createElement(PinterestShareView),
			React.createElement(RedditShareView)
		);
	}
});

var SocialEmbeddedView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(SocialSharingView),
			React.createElement(SocialSubscribeView),
			React.createElement(SocialDonateView)
		)
	}
});

var SocialView = React.createClass({
	render: function() {
		return React.createElement(SocialEmbeddedView);
	}
});