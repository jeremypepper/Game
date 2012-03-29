var Game = new (function () {
	this.save = function(game){
		game.saved = true;
		geddy.db.SaveGame(game);		
		geddy.games.push(game);
	};
	this.load = function(id,callback){
		for (var i in geddy.games) {
	      if (geddy.games[i].id == id) {
	        return callback(geddy.games[i]);
	      }
		}
		return callback({});
	};
})();
exports.Game = Game;