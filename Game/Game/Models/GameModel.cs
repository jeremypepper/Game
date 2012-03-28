using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Game.Models
{
    public class GameModel
    {
        private string drawName;
        private string answerName;
        private string p;

        public Guid Id { get; set; }
        public string DrawFriend { get; set; }
        public string AnswerFriend { get; set; }
        public string Word { get; set; }
        public string Drawing { get; set; }
        public bool IsComplete { get; set; }

        public GameModel() { }
        public GameModel(string drawName, string answerName, string word)
        {
            // TODO: Complete member initialization
            this.DrawFriend = drawName;
            this.AnswerFriend = answerName;
            this.Word = word;
            this.Id = Guid.NewGuid();
        }
    }
}