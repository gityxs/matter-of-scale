/**
 * Created by Adam on 7/22/2015.
 */

function Translator(defLang) {
	this.defLang = defLang;
	this.active = ko.observable("none");
	this.translations = {
		en: translationEN
	}
}
Translator.prototype.get = function(key) {
	var self = this;
	return ko.computed(function() {
		var dict = self.translations[self.active()];

		if(!dict || !dict[key])
			dict = self.translations[self.defLang];

		if(!dict.hasOwnProperty(key) && console)
			console.log("Missing translation for " + key);

		return dict[key] || "["+key+"]";
	});
};