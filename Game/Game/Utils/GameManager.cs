using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Game.Models;

namespace Game.Utils
{
    public class GameManager
    {
        static Dictionary<string, List<Guid>> activeGameLookup = new Dictionary<string, List<Guid>>();
        static Dictionary<Guid, GameModel> games = new Dictionary<Guid, GameModel>();
        static SortedList<string, string> friends = new SortedList<string, string>();

        public static GameModel CreateGame(string drawName,string answerName)
        {
            var game = new GameModel(drawName,answerName,WordList.GetWord());
            games.Add(game.Id, game);
            if (!activeGameLookup.ContainsKey(drawName))
            {
                activeGameLookup[drawName] = new List<Guid>();
            }

            if (!activeGameLookup.ContainsKey(answerName))
            {
                activeGameLookup[answerName] = new List<Guid>();
            }

            activeGameLookup[drawName].Add(game.Id);
            activeGameLookup[answerName].Add(game.Id);
            return game;
        }

        internal static IEnumerable<GameModel> GetGames(string name)
        {
            if (!friends.ContainsKey(name))
            {
                friends.Add(name, name);
            }
            var friendsInserted = new List<string>(friends.Keys);
            List<GameModel> activeGames = new List<GameModel>();
            if (activeGameLookup.ContainsKey(name))
            {
                foreach (var item in activeGameLookup[name])
                {
                    activeGames.Add(games[item]);
                    friendsInserted.Remove(games[item].AnswerFriend == name?games[item].DrawFriend :games[item].AnswerFriend);
                }
            }

            foreach(var friend in friendsInserted)
            {
                if (friend != name)
                {
                    activeGames.Add(new GameModel() { DrawFriend = name, AnswerFriend = friend, Id = Guid.Empty });
                }
            }
            return activeGames;
        }

        internal static void SetDrawdata(Guid id, string drawData)
        {
            games[id].Drawing = drawData;
        }

        internal static GameModel GetGame(Guid id)
        {
            return games[id];
        }

        internal static GameModel CompleteGame(Guid id)
        {
            var game = games[id];
            game.IsComplete = true;

            //remove active game
            activeGameLookup[game.AnswerFriend].Remove(id);
            activeGameLookup[game.DrawFriend].Remove(id);
            return CreateGame(game.AnswerFriend, game.DrawFriend);
        }
    }
}