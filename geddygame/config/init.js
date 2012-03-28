
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