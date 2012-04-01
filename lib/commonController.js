// common controler methods

var CommonController = new (function(){
	this.verifyGetUser = function(controller, done)
	{
		var fbtoken = controller.cookies.get("fbauth");
		var fbid = controller.cookies.get("fbid");
		if(fbtoken)
		{
		  geddy.model.User.load(fbid,fbtoken,function(user){
		    done(user);
		  });
		}
		else
		{
		  done();
		}
	}
})();

exports.CommonController = CommonController;