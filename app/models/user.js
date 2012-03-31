var User = function () {
    this.defineProperties({
      id:    {type: 'string', required: true}
    , name:   {type: 'string', required: true}
    , token:   {type: 'string', required: false}
    , exipres:   {type: 'datetime', required: false}
    });

};

/*
// Can also define them on the prototype
User.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
User.someStaticMethod = function () {
  // Do some other stuff
};
User.someStaticProperty = 'YYZ';
*/

User = geddy.model.register('User', User);

