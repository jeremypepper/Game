var Games = function()
{
   this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

   this.index = function( req, resp, params )
   {
      geddy.log.debug( "In Games.index" );

      var self = this;

      geddy.commonController.verifyGetUser( this,
         function( user )
         {
            if( user )
            {
               geddy.db.LoadGamesByUserId( user.id,
                  function( gamesDB )
                  {
                     if( gamesDB === null )
                        gamesDB = [];

                     self.respond( { games: gamesDB } );
                  }
               );
            }
            else
               self.respond( { games: [] } );
         }
      );
   };

   this.add = function( req, resp, params )
   {
      var self = this;
      geddy.log.info( "in add" );
      function gotUserCallback( user )
      {
         self.respond( { user: user, params: params } );
      }

      geddy.commonController.verifyGetUser( this, gotUserCallback )
   };

   this.create = function( req, resp, params )
   {
      // todo error handling on user input
      var self = this;
      geddy.log.info( "in creategame " );
      function gotUserCallback( user )
      {
         if( !user )
         {
            geddy.log.error( "error authenticating user" )
            self.redirect( { controller: self.name, action: 'add?error=true' } );
         }

         // Save the resource, then display index page
         var word = geddy.wordlist.getWord();
         var game = geddy.model.Game.create( 
      {
         id: geddy.string.uuid( 10 ),
         drawFriend: user.id,
         drawName: user.name,
         //todo: verify that this is an actual friend of the user
         answerFriend: params.answerFriend,
         answerName: params.answerName,
         state: 0,
         word: word.word,
         difficulty: word.difficulty
      } );

         geddy.log.info( "is game valid " + game.isValid() );
         if( game.isValid() )
         {
            geddy.log.info( "saved game " + game.id )
            geddy.model.Game.save( game );
         } else
         {
            geddy.log.error( "error creating game" )
            geddy.log.error( game.isValid() )
            self.redirect( { controller: self.name, action: 'add?error=true' } );
         }

         //todo figure out why this isn't working
         //self.redirect({controller: self.name, id: game.id});
         self.redirect( "/games/" + game.id + ".json" );

      }

      geddy.commonController.verifyGetUser( this, gotUserCallback )
   };

   this.show = function( req, resp, params )
   {
      var self = this;
      geddy.log.info( "getting game " + params.id );
      geddy.db.LoadGameByGameId( params.id, function( game )
      {
         geddy.log.info( "got game " + game )
         self.respond( { game: game } );
      } );
   };

   this.edit = function( req, resp, params )
   {
      this.respond( { params: params } );
   };

   this.update = function( req, resp, params )
   {
      // Save the resource, then display the item page
      geddy.log.info( "ID:" + params.id );
      geddy.log.info( "drawData:" + params.drawData );
      var self = this;
      geddy.model.Game.update( params.id, params.drawData, function( game )
      {
         self.redirect( { controller: this.name, id: params.id } );
      } );
   };

   this.remove = function( req, resp, params )
   {
      this.respond( { params: params } );
   };
};

exports.Games = Games;