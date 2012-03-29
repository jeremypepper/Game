
// Add uncaught-exception handler in prod-like environments
if (geddy.config.environment != 'development') {
  process.addListener('uncaughtException', function (err) {
    geddy.log.error(JSON.stringify(err));
  });
}

geddy.games = [];
geddy.users = [];
geddy.model.adapter = {};
geddy.model.adapter.Game = require(process.cwd() + '/lib/model_adapters/game').Game;
geddy.model.adapter.User = require(process.cwd() + '/lib/model_adapters/user').User;

// Setup DB connection
var MongoDB = function()
{ 
   var EnsureConnection = function( callback )
   {
      if( this.Db )
      {
         geddy.log.debug( "Found persist db connection." );
         callback.call( this );
         return;
      }
      
      geddy.log.debug( "Ensuring db connection." );
      
      var internalDb = require('mongodb').Db;
      var Server = require('mongodb').Server;
      
      internalDb.connect( "mongodb://localhost:27017/GeddyGame",
         function( err, db )
         {
            if( err )
               geddy.log.error( "Error opening MongoDB " + err );
            else  
            {
               this.Db = db;
               geddy.log.debug( "Opened MongoDB connection." );
               callback.call( this );
            }
         }
      );
   }
   
   var EnsureGameCollection = function( callback )
   {
      geddy.log.debug( "Ensuring game collection" );
      
      if( this.Db )
         Db.collection( "games", 
            function( err, collection )
            {
               if( err )
                  geddy.log.error( "Unabled to find/create game collection" );
               else
               {
                  geddy.log.debug( "Got collection: " + collection );
                  callback.call( this, collection );
               }
            }
         );
   }
   
   this.SaveGame = function( game )
   {
      geddy.log.debug( "Saving game: " + game );
      EnsureConnection(
         function()
         {
            EnsureGameCollection(
               function( collection )
               {
                  // Finally... save the game
                  if( collection )
                  {
                     geddy.log.debug( "TODO ryknuth: insert actual game when structure is complete." );
                     return;
                     collection.insert( [ { firstname:"Ryan", lastname:"Knuth" }, { firstName:"Jeremy", lastname:"Hay" } ], { safe:true },
                        function( err, result )
                        {
                           if( err )
                              geddy.log.error( "Unabled to write to the collection" );
                           else
                              geddy.log.debug( "Wrote: " + game );
                        }
                    );
                  }
               }
            );
         }
      );
   }
   
   var CloseConnection = function()
   {
      if( this.Db )
         this.Db.close();
   }
   
   // "Constructor"
   this.Db;
   EnsureConnection( function() {} );
}

geddy.db = new MongoDB();