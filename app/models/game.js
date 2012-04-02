var Game = function () {
  this.defineProperties({
    id:    {type: 'string', required: true}
  , drawFriend:   {type: 'string', required: true}
  , drawName:   {type: 'string', required: true}
  , answerFriend:   {type: 'string', required: true}
  , answerName:   {type: 'string', required: true}
  , state:   {type: 'number', required: true}
  , drawData: {type: 'string', required: false}
  });
  
  this.validatesPresent('id');
  this.validatesPresent('drawFriend');
  this.validatesLength('drawFriend', {min: 2});
  this.validatesPresent('answerFriend');
  this.validatesLength('answerFriend', {min: 2});
  this.validatesPresent('drawName');
  this.validatesPresent('answerName');
  this.validatesWithFunction('state', function (status) {
  	return status === 0 || status === 1 || status === 2;
  });
};

/*
// Can also define them on the prototype
Game.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Game.someStaticMethod = function () {
  // Do some other stuff
};
Game.someStaticProperty = 'YYZ';
*/

Game = geddy.model.register('Game', Game);

