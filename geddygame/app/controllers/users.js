
var Users = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    this.respond({users: geddy.users});
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
     // Save the resource, then display index page
    var user = geddy.model.User.create({ id: params.name, name: params.name});
    user.save();
    this.redirect({controller: this.name});
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.User.load(params.id,function(game){
      self.respond({user:game});
    });
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
    this.respond({params: params});
  };

};

exports.Users = Users;

