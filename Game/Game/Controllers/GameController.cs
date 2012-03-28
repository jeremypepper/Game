using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Game.Utils;
using Game.Models;

namespace Game.Controllers
{
    public class GameController : Controller
    {
        //
        // GET: /Game/
        public ActionResult Index()
        {
            return new EmptyResult();
        }

        public ActionResult Create(string drawFriend, string answerFriend)
        {
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            return Json(GameManager.CreateGame(drawFriend, answerFriend), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Games(string name)
        {
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            return Json(GameManager.GetGames(name), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs("GET","POST")]
        public ActionResult Complete(Guid id, string drawData=null, string guess=null)
        {
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            if (string.IsNullOrEmpty(drawData))
            {
                var game = GameManager.GetGame(id);
                if (string.Equals(guess, game.Word, StringComparison.CurrentCultureIgnoreCase))
                {
                    GameManager.CompleteGame(game.Id);
                }

                return Json(new { Success = game.IsComplete }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                //save post data to db
                GameManager.SetDrawdata(id, drawData);
                return Json(new { Success = true }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
