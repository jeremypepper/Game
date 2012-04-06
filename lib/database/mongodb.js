var MongoDb = new (function()
{
   // "Constructor"
   this.Db;
   var gamesCollectionName = "games";
   var usersCollectionName = "users";
   EnsureConnection( function() {} );

   // Public interface
   this.SaveGame = function( game )
   {
      Save( game, gamesCollectionName );
   }
   
   this.SaveUser = function( user )
   {
      Save( user, usersCollectionName );
   }
   
   this.LoadGamesByUserId = function( userid, callback )
   {
      geddy.log.debug( "Loading games from user: " + userid );
      EnsureConnection(
         function()
         {
            EnsureCollection( gamesCollectionName,
               function( collection )
               {
                  if( collection )
                  {
                     // TODO ryknuth: load the collection
                     /*collection.find( { $or : [ { "drawFriend" : 1 }, { "answerFriend" : 2 } ] },
                        function( err, result )
                        {
                           if( err )
                              geddy.log.error( "Unabled to load games from user: " + userid );
                           else
                              geddy.log.debug( "Loaded games for user: " + userid );
                        }
                    );*/
                  }
               }
            );
         }
      );

   }
   
   this.LoadUser = function( callback )
   {
      // TODO ryan: load user
   }

   // Internal functions
   function EnsureConnection( callback )
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

      if(process.env.MONGOHQ_URL === undefined)
      {
         url = "mongodb://localhost:27017/GeddyGame";
      }
      else
      {
         url = process.env.MONGOHQ_URL;
      }
      internalDb.connect( url,
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

   function EnsureCollection( collectionName, callback )
   {
      if( this.Db )
         Db.collection( collectionName,
            function( err, collection )
            {
               if( err )
                  geddy.log.error( "Unabled to find: " + collectionName );
               else
               {
                  geddy.log.debug( "Got collection: " + collectionName );
                  callback.call( this, collection );
               }
            }
         );
   }
   
   function Save( data, collectionName )
   {
      geddy.log.debug( "Saving data: " + JSON.stringify( data ) + " to collection: " + collectionName );
      EnsureConnection(
         function()
         {
            EnsureCollection( collectionName,
               function( collection )
               {
                  // Finally... save the data
                  if( collection )
                  {
                     collection.insert( data,
                        function( err, result )
                        {
                           if( err )
                              geddy.log.error( "Unabled to write to: " + collectionName );
                           else
                              geddy.log.debug( "Wrote: " + JSON.stringify( data ) );
                        }
                    );
                  }
               }
            );
         }
      );
   }

   function CloseConnection()
   {
      if( this.Db )
         this.Db.close();
   }
} )

exports.MongoDb = MongoDb;
