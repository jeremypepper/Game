
var Games = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    this.respond({games: geddy.games});
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    // Save the resource, then display index page
    var game = geddy.model.Game.create(
      { 
        id: geddy.string.uuid(10),
        drawFriend: params.drawFriend,
        answerFriend:params.answerFriend,
        state: 0
      });
    game.save();
    this.redirect({controller: this.name});
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Game.load(params.id,function(game){
      self.respond({params:game});
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

exports.Games = Games;

