// facebook.js

var Facebook = new (function () {
	var QueryString = require("querystring")
	 	, ajax = (global.geddy && global.geddy.ajax) || require("./lib/utils/ajax").Ajax
	 	, string = (global.geddy && global.geddy.string) || require("./lib/utils/string").String
		, fbgraph = "https://graph.facebook.com"
		, fbgraphFormat = fbgraph + "/{0}?access_token={1}";

	function authGraphCall(path,token,cb)
	{
		var url = string.format(fbgraphFormat, path,token)
		ajax.get(
			url
			,function(res,data){
				cb(JSON.parse(data));
			}
			,cb({error:"Error calling fb"})
		);
	}

	this.getMe = function(token,cb)
	{
		authGraphCall("me", token, cb);
	};

	this.getFriends = function(token,cb)
	{
		authGraphCall("friends",token,cb);
	}

	this.getServerAuthUrl = function(clientid,redirecturi,fbstate)
	{
		return string.format("https://www.facebook.com/dialog/oauth?client_id={0}&redirect_uri={1}&state={2}"
			, clientid
			, redirecturi
			, fbstate
		);
	}

	this.getServerAccessTokenUrl = function(redirectPath, code, callback){
		var redirecturi = "http://" + geddy.config.fbhost+redirectPath
		var fbtokenpath = fbgraph + "/oauth/access_token?"
        + "client_id="+ geddy.config.fbapp
        + "&redirect_uri=" + encodeURIComponent(redirecturi)
        + "&client_secret=" +  geddy.config.fbsecret
        + "&code="+code;

        function done(res,data){
        	data = data?data:null;
        	callback(data);
        }

        ajax.get(
        	fbtokenpath,
        	done,
        	done
        );
	}
})();

exports.Facebook = Facebook;