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
		
		if(parsedUrl.protocol == "http:")
		{
			scheme = http;
			if(!parsedUrl.port)parsedUrl.port = 80;
		}
		else if( parsedUrl.protocol == "https:")
		{
			scheme = https;
			if(!parsedUrl.port)parsedUrl.port = 443;
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

		log.info("in get for url: "+url);
		log.info("parsedUrl.protocol: "+options.host);
		log.info("parsedUrl.path: "+options.path);
		log.info("parsedUrl.port: "+options.port);

		scheme.get(options,function(res){
			resp = res;
			success = res.statusCode==200;
			console.info("statusCode: " + res.statusCode);
			res.on("data",function(chunk){data.push(chunk)});
			res.on("close",function(){ log.info("got a close event"); done();});
			res.on("end",function(){
				log.info("at get end");
				done();
			});
        }).on("error",function(){
        	log.error("error calling url")
        	done()
        });
	};
})();
exports.Ajax = Ajax;