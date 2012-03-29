var Game = new (function () {
	this.save = function(game){
		game.saved = true;
		// todo: ryan we will want to actually save this into a db here
		geddy.games.push(game);
	};
	this.load = function(match,callback){
		var validator;
		geddy.log.info("match type is  "+typeof(match));;
		if(typeof(match)==="string")
		{
			validator=function(game){geddy.log.info("game id " + game.id+"     match: "+match); return game.id==match; }
		}
		else if(typeof(match)==="object")
		{
			validator=function(game){ return game.drawFriend === match.drawFriend && game.answerFriend === match.answerFriend;};
		}
		else
		{
			return callback(null);
		}

		for (var i in geddy.games) {
	      if (validator(geddy.games[i])) {
	        return callback(geddy.games[i]);
	      }
		}
		return callback(null);
	};
})();
exports.Game = Game;