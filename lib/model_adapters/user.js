var User = new (function () {
	this.save = function(user){
		user.saved = true;
		// todo: ryan we will want to actually save this into a db here
		geddy.users.push(user);
	};
	this.load = function(id, token, callback){
		for (var i in geddy.users) {
			var user = geddy.users[i];
			if (user.id == id && user.token ==token) {
				return callback(geddy.users[i]);
			}
		}
		return callback(null);
	};
})();
exports.User = User;