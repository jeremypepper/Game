var Game = function () {
  this.defineProperties({
    id:    {type: 'string', required: true}
  , drawFriend:   {type: 'string', required: true}
  , drawName:   {type: 'string', required: true}
  , answerFriend:   {type: 'string', required: true}
  , answerName:   {type: 'string', required: true}
  , state:   {type: 'number', required: true}
  , drawData: {type: 'string', required: false}
  , word: {type: 'string', required: true}
  , difficulty: {type: 'int', required: true}
  });
  
  this.validatesPresent('id');
  this.validatesPresent('drawFriend');
  this.validatesLength('drawFriend', {min: 2});
  this.validatesPresent('answerFriend');
  this.validatesLength('answerFriend', {min: 2});
  this.validatesPresent('drawName');
  this.validatesPresent('answerName');
  this.validatesPresent('word');
  this.validatesWithFunction('state', function (status) {
  	return status === 0 || status === 1 || status === 2;
  });
};


geddy.log.info("getOtherUserId: " + Game.getOtherUserId);

// static functions must be declared after registering
Game.getOtherUserId = function(game, myUserId){
  if(game.drawFriend != myUserId){
    return game.drawFriend;
  }
  else{
    return game.answerFriend;
  }
};

Game.getOtherUserName = function(game, myUserId){
  if(game.drawFriend != myUserId){
    return game.drawName;
  }
  else{
    return game.answerName;
  }
};

