var assert = require("assert");
var ajax = require("./lib/utils/ajax.js").Ajax;
console.log(ajax);


console.log("starting tests");
assert(ajax, "test ajax exists")
ajax.get("http://www.msn.com",
  function(resp, data){
    console.log(resp.statusCode + " length: "+ data.length );
    assert(resp.statusCode==200,"non 200 statusCode");
    assert(data.length >= 1000, "length should be >= 1000")
  }
);


var string = require("./lib/utils/string.js").String;
assert("foo bar baz", string.format("{0} bar {1}","foo","baz"));

