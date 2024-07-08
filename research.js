var research_currency_cost;

function research_currency_cost_observable(res_level_obs) {
  return ko.computed(function() {
    if(res_level_obs() < 0) return -1;

    return (res_level_obs()+1) * 5;
  });
}

function research_volitile_create() {
  research_currency_cost = research_currency_cost_observable(res_view_level);
}

function research_val_observable_rank(res, rank, level) {
	return ko.computed(function() {
		return res.val(level, rank());
	});
}

function research_val_observable(res, level) {
	if(res.bid != undefined)
  	return ko.computed(function() { return res.val(level, game.levels[level].buildings[res.bid].ranks[res.type]()); });
	else
		return ko.computed(function() { return res.val(level, game.levels[level].ranks[res.type]()); });
}

function researchrankobservable(res, level) {
	if(res.bid != undefined)
		return game.levels[level].buildings[res.bid].ranks[res.type];
	else
		return game.levels[level].ranks[res.type];
}