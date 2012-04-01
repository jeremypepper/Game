// string.js string utils

var String = new (function () {
	this.format = function() {
	 var args = arguments;
	   return args[0].replace(/{(\d+)}/g, function(match, number) { 
	   	number = parseInt(number,10) + 1;
	     return typeof args[number] != 'undefined'
	       ? args[number]
	       : match
	     ;
	   });
	};
})();
exports.String = String;