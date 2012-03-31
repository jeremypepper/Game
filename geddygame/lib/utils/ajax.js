// ajax.js
var Ajax = {};
(function () {
	var http = require("http");
	var https = require("https");
	var Url = require("url");
	var log = (global.geddy&&global.geddy.log)?global.geddy.log:console;
	log.info("fcn start");
	Ajax.get = function(url,successcb,failcb,finallycb){
		var data = [];
        var success;
        var resp;
        var done = function(){
        	if(success)
        	{
        		if(successcb) successcb(resp,data.join());
        	}
        	else
        	{
        		if(failcb)failcb(data);
        	}
        	
        	if(finallycb)finallycb();
        };

		parsedUrl = Url.parse(url);
		log.info("in get");
		log.info("parsedUrl: "+parsedUrl.protocol);
		if(parsedUrl.protocol == "http:")
		{
			scheme = http;
		}
		else if( parsedUrl.protocol == "https:")
		{
			scheme = https;
		}
		else
		{
			//todo add more schemetypes
			console.error("errror: unsupported protocol in ajax.js");
			done();
		}

		
		var options = {
	        host: parsedUrl.hostname,
	        port: parsedUrl.port,
	        path: parsedUrl.path
      };

		

		http.get(options,function(res){
			resp = res;
			success = res.statusCode==200;
			console.info("statusCode: " + res.statusCode);
			res.on("data",function(chunk){data.push(chunk)});
			res.on("close",function(){ log.info("got a close event"); done();});
			res.on("end",function(){
				log.info("at get end");
				done();
			});
        }).on("error",function(){done()});
	};
})();
exports.Ajax = Ajax;