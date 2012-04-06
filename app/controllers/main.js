var Main = function () {
	var QueryString = require("querystring")
			, facebook = geddy.facebook
			, ajax = geddy.ajax
			, url = require("url")
			, fbgraph = "https://graph.facebook.com"
			, fbStateLookup = "fbstate";

	this.index = function (req, resp, params) {
		var self = this;
		var result = {};

		var gotUserCallback = function(user){
			result.user = user;
			if(user){
            geddy.db.LoadGamesByUserId( user.id,
               function( games )
               {
                  if( games === null )
                     geddy.log.error( "Failed to get games from: " + user.id );
                  else
                  {
                     geddy.games = games;
                     result.games = geddy.games;
                  }

                  done();
               });
			}
			else{
				result.games = {};
				done();
			}
		};

		function done(){
			self.respond(
				result,
				{
					format: 'html'
					, template: 'app/views/main/index'
				}
			);
		}

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
		var redirecturl = facebook.getServerAuthUrl(geddy.config.fbapp,returnUrl,fbstate);
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
			}else{
				geddy.log.error(data.error);
				self.respond(data,{format:'html',template:'app/views/main/return'});
			}
		}
		var errorhandler = function()
		{
			var errormsg = "oh snap, got an error in returnFromFacebook";
			geddy.log.error(errormsg);
			done({error:"oh snap, got an error in returnFromFacebook"});
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
			var errmsg = "error: state is invalid or can't get code from callback";
			geddy.log.error(errormsg);
			geddy.log.error(query);
			done({error:errormsg});
		}
	};

	this.wipe =function(req,resp,params){
		// HOLY CRAP WIPES THE DB
		if(req.method === 'POST')
		{
			geddy.db.DropDatabase();
			geddy.log.info("wiping db")
		}

		geddy.log.info("wipe")
		this.respond({}, {	format: 'html', template: 'app/views/main/wipe'});
	};
};

exports.Main = Main;