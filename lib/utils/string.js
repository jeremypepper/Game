// string.js string utils

var String = new (function () {
	this.format = function() {
	  var args = arguments;
	  return arguments[0].replace(/{(\d+)}/g, function(match, number) { 
	    return typeof args[number] != 'undefined'
	      ? args[number+1]
	      : match
	    ;
	  });
	};
})();
exports.String = String;