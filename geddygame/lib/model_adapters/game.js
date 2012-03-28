var Game = new (function () {
	this.save = function(game){
		game.saved = true;
		// todo: ryan we will want to actually save this into a db here
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