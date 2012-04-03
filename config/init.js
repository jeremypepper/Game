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
geddy.db = require(process.cwd() + '/lib/database/mongodb').MongoDb;
geddy.ajax = require(process.cwd() + '/lib/utils/ajax').Ajax;
geddy.facebook = require(process.cwd() + '/lib/utils/facebook').Facebook;
var stringutils = require(process.cwd() + '/lib/utils/string').String;
for (var p in stringutils) {
  geddy.string[p] = stringutils[p];
}

geddy.commonController = require(process.cwd() + '/lib/commonController').CommonController;

var words = require(process.cwd() + '/config/words').Words;
geddy.wordlist = require(process.cwd() + '/lib/utils/wordlist').WordList(words);
