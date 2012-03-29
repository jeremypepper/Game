
var Games = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    this.respond({games: geddy.games});
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this;
    geddy.log.info("loading");
    // check to see if exists first
    geddy.model.Game.load(params,function(game){
    geddy.log.info("loaded");
    geddy.log.info("game is " + game);
    geddy.log.info(!!game);
    if(!game)
    {
      geddy.log.info("create a resource");
      // Save the resource, then display index page
      game = geddy.model.Game.create(
      { 
        id: geddy.string.uuid(10),
        drawFriend: params.drawFriend,
        answerFriend:params.answerFriend,
        state: 0
      });

      if (game.isValid()) {
        game.save();
      } else {
        self.redirect({controller: self.name, action: 'add?error=true'});
      }
    }
    
    //self.redirect({controller: self.name, id: game.id});
    self.redirect("/games/"+game.id);
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Game.load(params.id,function(game){
      geddy.log.info("load in show: game is " + game);
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

  this.intern = function(req,resp,params){
    geddy.log.info("INTERN!");
    var self = this;
    geddy.model.Game.load(params,function(game){
      geddy.log.info("load in intern: game is " + game);
      if(!game)
      {
        // Save the resource, then display index page
        game = geddy.model.Game.create(
        { 
          id: geddy.string.uuid(10),
          drawFriend: params.drawFriend,
          answerFriend:params.answerFriend,
          state: 0
        });

        geddy.log.info("create game is: "+game);
        if (game.isValid()) {
          game.save();
        } else {
          game = {};
        }
      }

      self.respond({"game": game});
    });
  };
};

exports.Games = Games;

