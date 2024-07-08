// Copywrite 2014 Robert Adam Mitchell
var MOUSE_L = 0;

var eventobj = {};

var updatetick = 1000/10;
var catchup_time = ko.observable(-1);
var mouse_down = [].repeat(0, 10);
var num_down = [].repeat(0, 10);
var last_update = 0;
var catchup_ratio = 0.25;
var on_mouse_up = [];

var shift_down = false;
var ctrl_down = false;

var game = null;

var view_place = null;
var view_level = null;
var res_view_level = ko.observable(-1);
var in_update = ko.observable(false);
var info_mode = ko.observable("");
var debug_show = ko.observable(null);
var debug_mode = ko.observable(null);
var debug_force_complete = ko.observable(-1);
var time_currency_rate = 30 * 60;

var level_nodes = [];

// Building autobuy
var building_autobuy = null;
var building_autobuy_count = 0;
var building_autobuy_id = -1;

var dispatcher = new Dispatcher();
var translator = new Translator("en");

Tooltip.defaults.auto = 1;

var gTooltip      = new Tooltip();
var gTooltipOwner = null;

function removenode(place) {
	var vp = view_place();
	if(vp == place) viewnextplace();
}

function currencyicon(level) {
	return "<img class='tip' title='"+leveldata[level].currency.capitalize()+"' src='/img/level"+level+"curr.png' />"
}

function prestige_png(level) {
  return "img/level"+level+"pres.png";
}

function placeicon(level) {
	return "'img/level"+level+"place.png'"
}

function placeinfogoals(place) {
	var ret = "";
	
	for(var i=0; i<place.goals().length; i++) {
		var goal = place.goals()[i];

		ret += goal.desc();
	}
	
	return ret;
}

function upgradesshowcompleted() {
	var comp = $("#upg-comp");
	if(comp.hasClass("hidden"))
		comp.removeClass("hidden");
	else 
		comp.addClass("hidden");
}

function researchimg(level) {
	return "img/level"+level+"pres.png";
}

function researchimgtag(level) {
	return "<img src="+researchimg(level)+"></img>";
}

function researchshowcompleted() {
	var comp = $("#res-comp");
	if(comp.hasClass("hidden"))
		comp.removeClass("hidden");
	else 
		comp.addClass("hidden");
}

function timedisplay(ms) {
	return Math.floor(ms/1000).toString();
}

function setmainview(id) {
  view_place(game.get_place(id));
}

function bld(level, bid) {
  return leveldata[level].buildings[bid];
}

function buildingbuymouse(force) {
	var place = view_place();
	if(building_autobuy_id < 0) return;

	if(mouse_down[MOUSE_L] !== 0 || force) {
		building_autobuy_count++;
		place.building_buy(building_autobuy_id, 1);
	}
}

function buildingbuytimer() {
	var place = view_place();

	buildingbuymouse(false);

	for(var i=0; i<num_down.length; i++) {
		if(num_down[i]) {
			place.building_buy(i, 1);
		}
	}
}

function mouseup(evt) {
	mouse_down = [].repeat(0, 10);
	
	if(mouse_down[MOUSE_L] === 0 && on_mouse_up.length > 0) {
		for(var f in on_mouse_up)
			on_mouse_up[f]();
		on_mouse_up = [];
	}
}

function mousedown(evt) {
	mouse_down = [].repeat(0, 10);
	mouse_down[evt.button] = 1;
}

function buildingup(evt) {
	if(building_autobuy_count <= 0) {
		buildingbuymouse(true);
	}
	building_autobuy_id = -1;
}

function purchase_start(bid) {
	var place = view_place();
	if(place.complete >= 100) return true;

	on_mouse_up.push(buildingup);

	building_autobuy_count = 0;
	building_autobuy_id = bid;
}

function buildingdown(evt) {
	mousedown(evt);
	if(evt.button !== MOUSE_L) return true;

	purchase_start(evt.data);

	return false;
}

function handleplacecreate(place) {
	if(view_place() == null) {
		view_place(place);
	}
}

function handleplacedelete(place) {
	removenode(place);
}

function getsavefile(old) {
	var filename = "savefile" + env.save;
	if(old) filename += "-old";
	return filename;
}

function save(toast) {
	var saved = game.save();

	var rawstr = JSON.stringify(saved);
	var compressed = LZString.compressToUTF16(rawstr);
	
  localStorage.setItem(getsavefile(), compressed);
	
	if(toast)
		$.jGrowl("Saved!");
}

function researchreset7(savestate) {
	for(var i=0; i<savestate.levels.length; i++)
		savestate.levels[i].currency = 0;
		
	for(var i in savestate.places) {
		var place = savestate.places[i];
		if(place.completed) {
			savestate.levels[place.level].currency += 10;
			
			if(place.level > 0) {
				if(place.children.length > 0) {
					for(var j=0; j<place.children.length; j++) {
						if(!savestate.places.hasOwnProperty(place.children[j])) {
							// Deleted node, grant all children that would have existed
							for(var k=0; k<place.level - 1; k++)
								savestate.levels[k].currency += Math.pow(4, place.level - k) * 10;
						}
					}
				} else {
					for(var k=0; k<place.level; k++)
						savestate.levels[k].currency += Math.pow(4, place.level - k) * 10;
				}
			}
		}
	}
}

function versionupgrade_8_9(savestate) {
	// Clear goals to force regeneration
	for(var i=0; i<savestate.places.length; i++) {
		var old_place = savestate.places[i];

		old_place.goals = null;
	}

	savestate.version = 9;

	return savestate;
}

function versionupgrade(save) {
	if(save.version == 8)
		save = versionupgrade_8_9(save);

	return save;
}

function OptionsManager() {
	this.sound_enabled = ko.observable(-1);
}
OptionsManager.prototype.constructor = OptionsManager;
OptionsManager.prototype.toggleMute = function() {
	this.sound_enabled(!this.sound_enabled());
};
OptionsManager.prototype.save = function() {
	var saved = {};

	saved.sound_enabled = this.sound_enabled();

	return saved;
};
OptionsManager.prototype.load = function(saved) {
	if(!saved) return;

	this.sound_enabled(saved.sound_enabled);
};
OptionsManager.prototype.reset = function() {
	this.sound_enabled(false);
};

function SoundManager() {
	this.playing = {};
}
SoundManager.prototype.constructor = SoundManager;
SoundManager.prototype.playSound = function(event) {
	if(!app.game.options.sound_enabled()) return;

	this.playing[event] = this.playing[event] || [];

	var sound = new Audio("audio/"+event+".mp3");
	this.playing[event].push(sound);
	sound.play();
	sound.volume = 0.2;
};
SoundManager.prototype.init = function() {
	var self = this;
	app.game.options.sound_enabled.subscribe(function(value) {
		if(!value) self.stopAll();
	});
};
SoundManager.prototype.stopAll = function() {
	_.each(this.playing, function(list) {
		_.each(list, function(sound) {
			sound.pause();
		});
	});
};

function load() {
	var compressed = localStorage.getItem(getsavefile());
	if(!compressed) {
		return null;
	}
	var rawstr = LZString.decompressFromUTF16(compressed);

	var obj = undefined;
	try {
		obj = JSON.parse(rawstr);
	} catch(err) {
		console.log("Error: " + err.toString());
		ga('send', 'event', 'loaderror', 'parse', err.toString());
	}

	if(!obj)
		console.log("Failed to parse");
	else if(obj.version === 0)
		console.log("Version not set");
	else if(obj.version < minversion)
		console.log("Version too low");
	
	if(!obj || obj.version === 0 || obj.version < minversion)
		return null;
		
	if(obj.version != cur_version)
		localStorage.setItem(getsavefile(true), compressed);
	versionupgrade(obj);
	
	return obj;
}

function autosave() {
  save(true);
}

function tabsbeforeactive(event, ui) {
  ga('send', 'event', 'tab-click', ui.newTab.context.hash.substring(1));
}

function resetsoft() {
	ga('send', 'event', 'opt-click', 'resetsoft');
  if(confirm("Are you sure you want to reset? (There is no reset-prestige mechanic)")) {
    game.reset(false);
    save(false);
  }
}

function resethard() {
	ga('send', 'event', 'opt-click', 'resethard');
  if(confirm("Are you sure you want to hard reset?")) {
		game.reset(true);
    save(false);
  }
}

function savebutton() {
	ga('send', 'event', 'opt-click', 'manualsave');
	save(true);
}

var paused = false;
var updateIterval;
function pause() {
	ga('send', 'event', 'opt-click', 'pause', paused.toString());
  paused = !paused;
  if(paused)
    clearInterval(updateInterval);
  else
    updateInterval = setInterval(maintick, updatetick);
}

function debugtoggle() {
	debug_mode(!debug_mode());
}

function create_game() {
	view_place = ko.observable(null);
	view_level = ko.computed(function() { if(!view_place()) return -1; return view_place().level; });
	
	game = new Game();

	app.games.matter.live = game;

  // Research observables
  research_volitile_create();

  // Governor observables
  governor_volitile_create();
}

function viewlevelvisiblebind(div, level) {
	return function(value) { 
		if(value >= level) div.removeClass("hidden");
		else div.addClass("hidden");
	};
}

function savefixup(savefile) {
}

function clear_level_nodes() {
	for(var i=0; i<level_nodes.length; i++) {
		if(level_nodes[i]) {
			level_nodes[i] = null;
		}
	}
}

function postload(savefile) {
	var ret = !!savefile;
	clear_level_nodes();

	catchup_time(0);
	if(savefile) {
		savefixup(savefile);

		game.load(savefile);

		var time_ms = Date.now() - game.stats.last_save();
		catchup_time(time_ms / 1000);
	} else {
		game.new_game();

		ret = false;
	}

	var top = null;
	for(var i=leveldata.length-1; i>=0; i--) {
		if(game.levels[i].places().length > 0) {
			top = game.levels[i].places()[0];
		}
	}

	view_place(top);
	res_view_level(0);
	info_mode("goals");

	if(catchup_time() > 60) {
		ga('send', 'event', 'funnel', 'catchup', catchup_time());
		showcatchupdialog(catchup_time());
	}

	return ret;
}

function buttonimport() {
	ga('send', 'event', 'opt-click', 'import');

	var compressed = prompt("Enter your save text");
	
	var obj = null;
	try {
		var raw = LZString.decompressFromBase64(compressed);
		obj = JSON.parse(raw);
	} catch(error) { }
	
	if(!obj) {
		alert("Save could not be read. :(");
		ga('send', 'event', 'loaderror', 'import-fail');
		return;
	}
	
	var savefile = obj;
	
	if(savefile.version < minversion) {
		alert("Version is too low to import. :(  Requires: "+minversion);
		ga('send', 'event', 'loaderror', 'minversion', savefile.version.toString());
		return;
	}
	savefile = versionupgrade(savefile);
	
	alert("Save loaded successfully.");
	ga('send', 'event', 'import', 'success');
	
	postload(savefile);
}

function buttonexport() {
	var raw = JSON.stringify(game.save());
	var compressed = LZString.compressToBase64(raw);
	
	$("#export-text").val(compressed);
	$("#export-dlg").dialog();
	$("#export-text").select().focus();
	$("#export-dlg").removeClass("hidden");

	ga('send', 'event', 'opt-click', 'export');
}

function showcatchupdialog(total) {
	var jq_obj = $("#catchupdlg");
	var time_obj = $("#catch-up-time");

	catchup_time.subscribe(function(value) {
		var int = Math.floor(total - value);
		time_obj.text("Catching up... "+ int +" of "+Math.floor(total));

		if(value <= 0) {
			time_obj.text("Caught up "+Math.floor(total)+" seconds!");
			setTimeout(hidecatchupdialog, 750);
		}
	});
	ga('send', 'event', 'funnel', 'catchup-complete');

	jq_obj.dialog();
}

function hidecatchupdialog() {
	$("#catchupdlg").dialog("close");
}

function handlepatchnotes(data, status) { 
	var jq_obj = $("#dialog");
	
	while (jq_obj.firstChild) {
			jq_obj.removeChild(jq_obj.firstChild);
	}
	jq_obj.empty();

	var foundprod = false;
	for(var i = 0; i < data.responseJSON.length; i++) {
		var patch = data.responseJSON[i];
		var isCur = game_version == patch.id;
		var cl = "";
		var add = "";
		if(isCur) {
			cl = "curpatch";
			add = " (Current)";
		}
		if(patch.env) add += " ("+patch.env+")";
		jq_obj.append("<div id='note-"+i+"' class='patch "+cl+"'>"+patch.id+add+"</div>");
		
		var note = $("#note-"+i);
		for(var j = 0; j < patch.msgs.length; j++) {
			var msg = patch.msgs[j];
			var itemcl = "";
			if(msg.type) itemcl = msg.type;
			note.append("<div id='msg-"+i.toString()+"-"+j.toString()+"' class='patchmsg "+cl+" "+itemcl+"'>"+msg.desc+"</div>");
		}
	}

	jq_obj.dialog();
	jq_obj.dialog("option", "width", "80%");
}

function buttonpatchnotes() {
	var settings = {
		dataType: "json",
		complete: handlepatchnotes
	};
	
	$.ajax("/patchnotes.json", settings);

	ga('send', 'event', 'opt-click', 'patchnotes');
}

function buttonname() {
	var place = view_place();
	var newname = prompt("Enter name", place.name());
	if(newname && place.name() != newname) {
		place.name(newname);

		ga('send', 'event', 'game-click', 'namechange');
	} else {
		ga('send', 'event', 'game-click', 'namechange-cancel');
	}
}

function savetoobj(compressed) {
	var rawstr = LZString.decompressFromUTF16(compressed);
	
	var obj = undefined;
	try {
		obj = JSON.parse(rawstr);
	} catch(err) {
		console.log("Error: " + err.toString());
	}
	
	return obj;
}

function buttonrevert() {
	var compressed = localStorage.getItem(getsavefile(old));
	var oldstate = savetoobj(compressed);
	
	if(!oldstate) {
		alert("Sorry, your old save is no longer loadable.");
		return;
	}
	
	var date = new Date(oldstate.stats.lastsave);
	if(prompt("Your old save is from " + date.toLocaleString() + ". Are you sure you want to revert?")) {
		
	}
}

var dialog;
function debugtoggledialog() {
	$("#dbgdlg").dialog();
}

function debugcomplete() {
	if(!debug_mode()) return;
	
	debug_force_complete(view_place().id);
}

function debugaddevent() {
	if(!view_place() || !debug_mode()) return;

	var array = [];
	for(var i=0; i<game.nextactive.length; i++) {
		if(!game.nextactive[i].allowed()) continue;

		array.push(game.nextactive[i]);
	}

	var rand = randomarrayelem(array);
	rand.time = performance.now();
}

function debugaddgov() {
  if(!debug_mode()) return;

  var gov = new Governor();
  game.governors.push(gov);
}

function debugassigngov() {
  if(!debug_mode()) return;  if(!view_place()) return;

  var gov = randomarrayelem(game.governors());
  gov.assign(view_place());
}

function viewprevplace() {
	var index = game.levels[view_level()].places().indexOf(view_place());
	index = index - 1;
	if(index < 0) index = game.levels[view_level()].places().length - 1;

	view_place(game.levels[view_level()].places()[index]);
}

function viewnextplace() {
	var place = null;
	if(game.levels[view_level()].places().length <= 0 && view_level() > 0) {
		var level = view_level();
		while(game.levels[level].places().length <= 0 && level > 0)
			level--;
		if(game.levels[level].places().length > 0)
			place = game.levels[level].places()[0];
	} else {
		var index = game.levels[view_level()].places().indexOf(view_place());
		index = index + 1;
		if(index >= game.levels[view_level()].places().length) index = 0;

		if(game.levels[view_level()].places().length > 0)
			place = game.levels[view_level()].places()[index];
	}

	view_place(place);
}

function viewupplace() {
	for(var level = view_level() + 1; level < leveldata.length; level++) {
		if(game.levels[level].places().length > 0) {
			view_place(game.levels[level].places()[0]);
			return;
		}
	}
}

function viewdownplace() {
	for(var level = view_level() - 1; level >= 0; level--) {
		if(game.levels[level].places().length > 0) {
			view_place(game.levels[level].places()[0]);
			return;
		}
	}
}

function main_finish_click(evt) {
	if(!view_place()) return;
	if(view_place().completed() < 100) return;

	view_place().complete(false);

	evt.preventDefault();
}

function bind_wrap(obs, func) {
	return ko.computed(function() {
		return func(obs());
	});
}

function completeplace(evt) {
	main_finish_click(evt);
}

function buybuilding(id, down) {
	num_down[id] = down;
}

function upgradebuilding(index) {
	dispatcher.sendEvent("upgrade-attempt", {upgrade: upgrades[index]});
}

function retraingov() {
	governor_retrain_click();
}

function bindkeys() {
	$(document).keydown(function(evt) {
		var handled = true;
		console.log("key="+evt.which);
		switch(evt.which) {
			case 13: completeplace(evt); break;
			case 16: shift_down=true; break;
			case 17: ctrl_down=true; break;
			case 37: viewprevplace(); break;
			case 38: viewupplace(); break;
			case 39: viewnextplace(); break;
			case 40: viewdownplace(); break;
			case 97: case 49: if(!shift_down) buybuilding(0, true); else upgradebuilding(0); break;
			case 98: case 50: if(!shift_down) buybuilding(1, true); else upgradebuilding(1); break;
			case 99: case 51: if(!shift_down) buybuilding(2, true); else upgradebuilding(2); break;
			case 100: case 52: if(!shift_down) buybuilding(3, true); else upgradebuilding(3); break;
			case 101: case 53: if(!shift_down) buybuilding(4, true); else upgradebuilding(4); break;
			case 102: case 54: if(!shift_down) buybuilding(5, true); else upgradebuilding(5); break;
			case 103: case 55: if(!shift_down) buybuilding(6, true); else upgradebuilding(6); break;
			case 104: case 56: if(!shift_down) buybuilding(7, true); else upgradebuilding(7); break;
			case 105: case 57: if(!shift_down) buybuilding(8, true); else upgradebuilding(8); break;
			case 96: case 48: if(!shift_down) buybuilding(9, true); else upgradebuilding(9); break;
			case 65: debugaddevent(); break;
			case 67: debugcomplete(); break;
			case 68: debugtoggledialog(); break;
      case 71: debugaddgov(); break;
      case 72: debugassigngov(); break;
			case 82: retraingov(); break;
			default: handled = false; break;
		}
		if(handled)
			evt.preventDefault();
	});
	$(document).keyup(function(evt) {
		var handled = true;
		switch(evt.which) {
			case 16: shift_down = false; break;
			case 17: ctrl_down = false; break;
			case 97: case 49: buybuilding(0, false); break;
			case 98: case 50: buybuilding(1, false); break;
			case 99: case 51: buybuilding(2, false); break;
			case 100: case 52: buybuilding(3, false); break;
			case 101: case 53: buybuilding(4, false); break;
			case 102: case 54: buybuilding(5, false); break;
			case 103: case 55: buybuilding(6, false); break;
			case 104: case 56: buybuilding(7, false); break;
			case 105: case 57: buybuilding(8, false); break;
			case 96: case 48: buybuilding(9, false); break;
			default: handled = false;
		}
		if(handled)
			evt.preventDefault();
	});
}

var appElement = React.createElement(AppView, {game: "matter", env: "live"});
var SiteView = React.createClass({
	render: function() {
		return appElement;
	}
});

function maintick() {
	if(catchup_time() > 0) {
		var start = performance.now();
		while(performance.now() - start < 100 && catchup_time() > 0) {
			var tick = 10;

			if(tick > catchup_time() * catchup_ratio)
				tick = catchup_time() * catchup_ratio;

			game.tick(tick, true);

			catchup_time(catchup_time() - tick / catchup_ratio);
		}
	} else {
		if(last_update == 0) {
			last_update = performance.now();
			game.start();
		}
		var elapsed_ms = performance.now() - last_update;
		last_update = performance.now();
		var elapsed = elapsed_ms / 1000;

		game.tick(elapsed, false);
	}

	React.render(React.createElement(SiteView), document.getElementById("react"));
}

function handle_place_change(changes) {
	for(var i=0; i<changes.length; i++) {
		var change = changes[i];

		if(change.status == "added") {
			handleplacecreate(change.value);
		} else if(change.status == "deleted") {
			handleplacedelete(change.value);
		}
	}
}

function handle_donate_patreon(evt) {
	ga('send', 'event', 'donate-click', 'patreon');
}

function handle_donate_card(evt) {
	ga('send', 'event', 'donate-click', 'credit');
}

function handle_donate_bitcoin(evt) {
	ga('send', 'event', 'donate-click', 'bitcoin');
}

function mute_toggle(evt) {
	app.game.options.toggleMute();
}

function App() {
	this.games = {};

	this.games.matter = {};
	this.games.matter.live = game;

	this.game = {
		options: new OptionsManager(),
		sounds: new SoundManager()
	};
}
var app = new App();

$(function () {
	console.log("Starting");
	
	$(document).on("mousedown", mousedown);
	$(document).on("mouseup", mouseup);

	create_game();

	game.places.subscribe(handle_place_change, null, "arrayChange");

	app.game.sounds.init();

	achievements_create();
	achievements_init();

	setupactives();
	bindkeys();

	var savestate = load();
	var loaded = postload(savestate);
	
	if(document.URL.indexOf("localhost") > -1) {
		debug_mode(true);
		debug_mode(false);
		debug_mode(true);
		debug_show(true);
	} else {
		debug_mode(false);
		debug_show(false);
	}

	updateInterval = setInterval(maintick, updatetick);
	setInterval(buildingbuytimer, 100);
  setInterval(autosave, 30 * 1000);

	if(!loaded)
		ga('send', 'event', 'funnel', 'new_user', game_version);
	else
		ga('send', 'event', 'funnel', 'game_load', game_version);
});
