var Game = new (function () {
	this.save = function(game){
		game.saved = true;
		geddy.db.SaveGame(game);		
		geddy.games.push(game);
	};
	this.update = function(id,drawData,callback){
		geddy.model.Game.load(id,function(game){
			if(game)
			{
				game.drawData = drawData;
			}

			callback(game);
		});
	}
	this.load = function(match,callback){
		var validator;
		if(typeof(match)==="string")
		{
			validator=function(game){return game.id==match; }
		}
		else if(typeof(match)==="object")
		{
			validator=function(game){ return game.drawFriend === match.drawFriend && game.answerFriend === match.answerFriend;};
		}
		else if(typeof(match)==="function")
		{
			validator=match
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