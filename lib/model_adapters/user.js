// Use these as static functions! Models grabbed from the DB do not have these functions
var User = new (function () {
   this.save = function(user){
      user.saved = true;
      geddy.db.SaveUser(user);
      geddy.users.push(user);
   };
   this.load = function (id, token, callback)
   {
      geddy.db.LoadUser( id, token, callback );
   };
})();
exports.User = User;