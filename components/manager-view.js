/**
 * Created by Adam on 7/20/2015.
 */

var rarityclasses = ["common", "uncommon", "rare", "epic", "mythic", "legendary", "impossible"];

var ManagerAssignmentView = React.createClass({
	render: function() {
		var assigned = "Unassigned";
		if(this.props.assignment >= 0)
			assigned = leveldata[this.props.assignment].name;
		return React.createElement("div", {className: "govassn"}, assigned);
	}
});

var ManagerLevelView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "govlevel"}, "Level "+this.props.level);
	}
});

var ManagerXPView = React.createClass({
	render: function() {
		return React.createElement("div",  {className: "govxp"}, "XP "+Math.floor(this.props.xp));
	}
});

var AttrView = React.createClass({
	render: function() {
		return React.createElement("div", null, this.props.attr.desc());
	}
});

var ModView = React.createClass({
	render: function() {
		return React.createElement("div", null, _.map(this.props.mod.attrs, function(attr) {
			return React.createElement(AttrView, {attr: attr});
		}));
	}
});

var ManagerTooltipView = React.createClass({
	render: function() {
		return React.createElement("div", null, _.map(this.props.governor.mods, function(mod) {
			return React.createElement(ModView, {mod: mod});
		}));
	}
});

function governor_newslot_click(evt) {
	if(game.governors().length >= maxgovs) return;

	var cost = slot_cost();
	if(debug_mode()) cost = 0;
	if(game.time_currency() < cost) return;

	game.time_currency(game.time_currency() - cost);

	governor_limit_raise(1);

	if(evt)
		evt.preventDefault();
}

function governor_retrain_click(evt) {
	if(selected_gov() < 0) return;

	var cost = retrain_cost();
	if(debug_mode()) cost = 0;
	if(game.time_currency() < cost) return;

	game.time_currency(game.time_currency() - cost);

	var gov = game.governors[selected_gov()];
	gov.retrain();

	if(evt)
		evt.preventDefault();
}

function governor_assign_selected() {
	var id = selected_gov();

	if(id < 0) return;
	if(!view_place()) return;

	var gov = game.governors[id];
	var place = view_place();
	if(!gov.allowed(place.level)) return;

	if(gov.assigned() == place.level)
		gov.unassign();
	else
		gov.assign(game.levels[place.level]);
}

var ManagerRowView = React.createClass({
	mixins: [TooltipMixin],

	onClick: function() {
		governor_select({data: this.props.governor.id});
	},

	render: function() {
		var className = "govcont "+rarityclasses[this.props.governor.rarity()];
		if(this.props.selected)
			className += " selected";

		return React.createElement("div", {className: className, onClick: this.onClick},
			React.createElement("div", {className: "govname"}, this.props.governor.name()),
			React.createElement(ManagerAssignmentView, {assignment: this.props.governor.assigned()}),
			React.createElement(ManagerLevelView, {level: this.props.governor.level()}),
			React.createElement(ManagerXPView, {xp: this.props.governor.xp()})
		);
	},
	tooltipContent: function() {
		return React.createElement(ManagerTooltipView, {governor: this.props.governor});
	}
});

var ManagerListView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "manager-list"},
			_.map(app.games.matter.live.governors(), function(governor) {
				var selected = governor.id == selected_gov();
				return React.createElement(ManagerRowView, {governor: governor, selected: selected});
			})
		);
	}
});

var ManagerTalentView = React.createClass({
	render: function() {
		var text = translator.get("managers.talent")();
		return React.createElement("div", null, text + " " + game.magic_find() + "%");
	}
});

var ManagerTrainingView = React.createClass({
	onRetrain: function() {
		governor_retrain_click();
	},

	onNewSlot: function() {
		governor_newslot_click();
	},

	onAssign: function() {
		governor_assign_selected();
	},

	render: function() {
		return React.createElement("div", null,
			React.createElement("div", {className: "clicker button", onClick: this.onRetrain}, translator.get("managers.retrain")(),
				React.createElement(CurrencyView, {count: retrain_cost(), type: "time"})),
			React.createElement("div", {className: "clicker button", onClick: this.onNewSlot}, translator.get("managers.new_slot")(),
				React.createElement(CurrencyView, {count: slot_cost(), type: "time"})),
			React.createElement("div", {className: "clicker button", onClick: this.onAssign}, translator.get("managers.assign")()),
			React.createElement(ManagerTalentView)
		);
	}
});

var ManagerEmbeddedView = React.createClass({
	render: function() {
		return React.createElement("div", null,
			React.createElement(ManagerTrainingView),
			React.createElement(ManagerListView)
		);
	}
});

var ManagerView = React.createClass({
	render: function() {
		return React.createElement("div", {className: "manager"},
			React.createElement(ManagerEmbeddedView)
		);
	}
});