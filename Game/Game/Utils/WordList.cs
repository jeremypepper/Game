using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace Game.Utils
{
    public static class WordList
    {
        static Random rand = new Random();
        static List<string> words = new List<string>();
        static WordList()
        {
            string appdatafolder = Path.Combine(HttpRuntime.AppDomainAppPath, "App_Data");
            StreamReader reader = new StreamReader(Path.Combine(appdatafolder,"words.txt"));
            var line = reader.ReadLine();
            while (line != null)
            {
                words.Add(line);
                line = reader.ReadLine();
            }
        }

        public static string GetWord()
        {
            return words[rand.Next(words.Count)];
        }
    }
}