// facebook.js

var Facebook = new (function () {
	var QueryString = require("querystring"),
	 	ajax = geddy.ajax;
	var fbgraph = "https://graph.facebook.com";
	var fbStateLookup = "fbstate";

	this.getMe = function(token,cb)
	{
		ajax.get(
				fbgraph +"/me?access_token=" + token ,
			function(res,data){
				var me = JSON.parse(data);
				cb(me);
			}
			,cb({error:"Error calling fb"})
		);
	};
})();

exports.Facebook = Facebook;