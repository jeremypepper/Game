// Use these as static functions! Models grabbed from the DB do not have these functions
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
	this.load = function(match,callback, getMultiple){
		var validator;
		var items = [];
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
	        var item = callback(geddy.games[i]);
	        if(!getMultiple){
	        	return item;
	        }
	        items.push(item)
	      }
		}

		return callback(getMultiple?items:null);
	};
})();
exports.Game = Game;