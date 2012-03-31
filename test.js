var http = require("https");
var code = 12345;
console.log("calling facebook for token");
var fbtokenpath = "/";
var options = {
  host: "facebook.com",
  port: 80,
  path: fbtokenpath
};

console.log("doing a https call");
http.get(
  options,
  function(res){
    console.log("code" + res.statusCode);
    var success = res.statusCode==200;
    var data = [];
    console.log("got a complete"); 
    res.on("data",function(chunk){data.push(chunk); console.log("got a chunk");})
    res.on("end",function(){
      console.log("got a end data "+ data);

      if(success && data)
      {
        console.log(data);
        this.respond(params,{format:'html',template:'app/views/main/return'});
      }
      else
      {
        console.log("epic fail" + res.statusCode);
      }
    });
  }).on("error",function(e){
      geddy.log.info("in error")
      geddy.log.error(e);
      this.respond(params,{format:'html',template:'app/views/main/return'});
    });
console.log("after the async https call");