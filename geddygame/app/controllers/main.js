/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var Main = function () {
  var QueryString = require("querystring"),
      https = require("https");
  var fbStateLookup = "fbstate";
  this.index = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };

  this.gamesAndFriends = function (req, resp, params) {
    this.respondsWith = ['json'];
    this.respond({
      	games: geddy.games
      , friends: geddy.users
    });
  };

  this.connectToFacebook = function(req,resp,params){
    var fbstate = this.session.get(fbStateLookup);
    if(!fbstate){
      fbstate = geddy.string.uuid(128);
      this.session.set(fbStateLookup,fbstate);
    }

    this.redirect("https://www.facebook.com/dialog/oauth?client_id=405186406159531&redirect_uri=http%3A%2F%2Fzoopbloop.com%2Freturn&state="+fbstate);
  }

  this.returnFromFacebook = function(req,resp,params){
    //todo: make this query parsing into a util function
    geddy.log.info("in return from facebook. url:" + req.url)
    var url = require("url");
    var self = this;
    var query = url.parse(req.url,true).query;
    var stateIsValid = false;
    var code;
    var fbstate = this.session.get(fbStateLookup);
    var done = function(data){
      self.respond(data?data:params,{format:'html',template:'app/views/main/return'});
    }
    geddy.log.info("query: " + query);

    if(query.state && fbstate === query.state)
    {
      stateIsValid = true;
    }
    
    code = query.code

    if(stateIsValid && code)
    {
      geddy.log.info("calling facebook for token");
      var fbtokenpath = "/oauth/access_token?"
        + "client_id="+405186406159531
        + "&redirect_uri=http%3A%2F%2Fzoopbloop.com%2Freturn"
        + "&client_secret=693ab1df0adcfe0975b9896e751279d7"
        + "&code="+code;

      var options = {
        host: "graph.facebook.com",
        port: 443,
        path: fbtokenpath
      };
      
      geddy.log.info("doing a https call");

      // need to handle errors properly
      https.get(
        options,
        function(res){
          var success = res.statusCode==200;
          var data = [];
          geddy.log.info("got a complete"); 
          res.on("data",function(chunk){data.push(chunk); geddy.log.info("got a chunk");})
          res.on("close",function(){ geddy.log.info("got a close event");})
          res.on("end",function(){
            geddy.log.info("got a end data "+ data);

            if(success && data)
            {
              geddy.log.info("Yay we got a token");
              
              var qs = QueryString.parse(data.join());
              var token = qs.access_token;
              geddy.log.info("it expires in " + qs.expires);
              options.path = "/me?access_token=" + token;
              // todo check for errors
              https.get(options,function(res){
                var data = [];
                if(res.statusCode==200)
                {
                  res.on("data",function(chunk){data.push(chunk)});
                  res.on("close",function(){ geddy.log.info("got a close event");});
                  res.on("end",function(){
                    var me = JSON.parse(data.join());
                    geddy.log.info(me.id);
                    geddy.log.info(me.name);
                    geddy.model.User.load(me.id,function(user){
                      if(!user)
                      {
                        //dont have this user yet, need to create a new one
                        // todo: replace expires with now + expires
                        user = geddy.model.User.create({ 
                          id: me.id,
                          name: me.name,
                          token: token,
                          expires: new Date()});
                        geddy.model.User.create(me.id,function(user){});
                      }
                      else
                      {
                        user.token = token;
                        user.expires = expires;
                      }
                      user.save();
                      done();
                    });
                    
                  });
                }
              });
              done()
            }
          });
          res.on("error",function(e){
            geddy.log.error("in error")
            geddy.log.error(e);
          });
        }).on("error",function(e){
          geddy.log.error("in error")
          geddy.log.error(e);
          done();
          });
    }
    else
    {
      self.respond({},{format:'html',template:'app/views/main/return'});
    }
  };

};

exports.Main = Main;