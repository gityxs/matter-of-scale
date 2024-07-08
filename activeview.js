var max_actives = 20;

function setupactives() {
	for(var i=0; i<max_actives; i++) {
		$("#actives").append("<div id='active-"+i+"' class='active-cont clicker'></div>");
		$("#active-"+i).hide();
	}

	game.actives.subscribe(viewactivesbind(), null, "arrayChange");
}

function activesclear() {
	for(var i=0; i<max_actives; i++) {
		$("#active-"+i).hide();
	}
}

function activesinit(obsarray) {
	for(var i=0; i<obsarray.length; i++) {
		fillactive(i, obsarray()[i]);
	}
}

function fillactive(index, data) {
	var x = (Math.floor(Math.random() * 80) + 10) + "%";
	var y = (Math.floor(Math.random() * 80) + 10) + "%";
	var div = $("#active-"+index);
	div.hide();
	if(data.base.type=="upgradept") {
		div.html("<img src='"+data.base.icon()+"' class='active-img' /><div class='active-place'>"+leveldata[data.base.level].name+"</div>");
	} else {
		div.html("<img src='"+data.base.icon()+"' class='active-img' />");
	}
	div.css({"top": y, "left": x});
	div.off("click", activeclick);
	div.on("click", "", data, activeclick);
	div.fadeIn(2000);

	data.dividx = index;

	app.game.sounds.playSound("active_show");

	ga('send', 'event', 'actives', 'show', data.base.type);
}

function activeclick(evt) {
	if(!view_place()) return;
	
	var active = evt.data;

	if(active.clicked) return;
	
	active.clicked = true;
	active.base.click(active);

	ga('send', 'event', 'actives', 'click', active.base.type);
}

function viewactivesbind() {
	return function(changes) {
		for(var i=0; i<changes.length; i++) {
			var c = changes[i];
			if(c.status == "added") {
				fillactive(c.index, c.value);
			} else if(c.status == "deleted") {
				$("#active-"+c.value.dividx).fadeOut(200);
			}
		}
	};
}
