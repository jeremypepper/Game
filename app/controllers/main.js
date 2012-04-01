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
  var QueryString = require("querystring")
      , facebook = geddy.facebook
      , ajax = geddy.ajax
      , url = require("url")
      , fbgraph = "https://graph.facebook.com"
      , fbStateLookup = "fbstate";

  this.index = function (req, resp, params) {
    var self = this;
    var gotGamesAndUserCallback = function(user,games)
    {
      self.respond(
        {
          user:user
        },
        {
            format: 'html'
          , template: 'app/views/main/index'
        }
      );
    };

    var gotUserCallback = function(user){
      if(user){
        geddy.model.Game.load(
          function(game){
            return game.drawFriend == user.id || game.answerFriend == user.id;
          },
          function(games){
            gotGamesAndUserCallback(user,games)
          }
        );
      }
      else{
        gotGamesAndUserCallback(user);
      }
    };
    geddy.commonController.verifyGetUser(this,gotUserCallback)
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
    var returnUrl = encodeURIComponent("http://" + geddy.config.fbhost + "/return");
    var redirecturl = facebook.getServerAuthUrl(405186406159531,returnUrl,fbstate);
    this.redirect(redirecturl);
  }

  function loginOrRegisterUser(token,expires,cb)
  {
    // todo check for errors
    facebook.getMe(
      token ,
      function(data){
        if(data.error)
        {
          cb(data);
        }
        else
        {
          var me = data;
          geddy.model.User.load(me.id,token,function(user){
            if(!user)
            {
              // dont have this user yet, need to create a new one
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
              user.expires = new Date();
            }

            user.save();
            cb(user);
          });
        }
      }
    );
  }

  this.returnFromFacebook = function(req,resp,params){
    //todo: clean this crap up
    var url = require("url");
    var self = this;
    var query = url.parse(req.url,true).query;
    var stateIsValid = false;
    var code;
    var fbstate = this.session.get(fbStateLookup);
    var done = function(data){
      if(data&&data.id)
      {
        self.cookies.set("fbid",data.id, {path:"/"});
        self.redirect('/');
      }
    }
    var errorhandler = function()
    {
      geddy.log.error("oh snap, got an error in returnFromFacebook");
      done(null);
    }

    if(query.state && fbstate === query.state)
    {
      stateIsValid = true;
    }
    
    code = query.code

    if(stateIsValid && code)
    {
      function gotTokenCallback(data)
      {
         if(data)
          {
            var qs = QueryString.parse(data);
            var token = qs.access_token;
            var now = new Date();
            var expires = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds()+ parseInt(qs.expires,10),now.getMilliseconds());
            self.cookies.set("fbauth",token, {expires:expires,path:"/"});
            loginOrRegisterUser(token,qs.expires,done);
          }
          else
          {
            errorhandler()
          }
      }

      facebook.getServerAccessTokenUrl("/return", code, gotTokenCallback);
    }
    else
    {
      self.respond({},{format:'html',template:'app/views/main/return'});
    }
  };
};

exports.Main = Main;