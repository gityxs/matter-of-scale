Array.prototype.repeat = function(what, L){
 while(L) this[--L]= what;
 return this;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

ko.comparable = function(func, comparer) {
	return ko.computed(func).extend({notify: comparer});
};

function array_sum_observable(array) {
	return ko.computed(function() {
		var val = 0;
		for(var i=0; i<array().length; i++) {
			val += array()[i]();
		}
		return val;
	});
}

if(!window.performance) window.performance = {};

if(!window.performance.now) {
	if(Date.now) {
		window.performance.now = function() {
			return Date.now();
		};
	} else { 
		window.performance.now = function() {
			return +(new Date());
		};
	}
}

function rand(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function outerproduct(dictin) {
  var list = [{}];

  for(var o in dictin) {
    var opt = dictin[o];
    var optlist;

    if(Array.isArray(opt)) {
      optlist = opt;
    } else {
      optlist = [opt];
    }

    var nextlist = [];
    for(var i=0; i<list.length; i++) { 
      for(var j=0; j<optlist.length; j++) {
        var next = $.extend({}, list[i]);
        next[o] = optlist[j];
        nextlist.push(next);
      }
    }
    list = nextlist;
  }
  
  return list;
}

function nullobservable(value) {
	return function() { return value; };
}

function index_roll(roll, list, scale) {
  for(var i=list.length - 1; i>=0; i--) {
    if(scale && roll <= list[i] * scale) return i;
    else if(roll <= list[i]) return i;
  }

  return 0;
}
