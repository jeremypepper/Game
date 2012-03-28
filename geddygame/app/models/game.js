var Game = function () {
  this.defineProperties({
    id:    {type: 'string', required: true}
  , drawFriend:   {type: 'string', required: true}
  , answerFriend:   {type: 'string', required: true}
  , state:   {type: 'number', required: true}
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

