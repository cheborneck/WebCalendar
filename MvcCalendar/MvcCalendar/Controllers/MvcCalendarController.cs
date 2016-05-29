using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcCalendar.Controllers
{
    public class MvcCalendarController : Controller
    {
        // 
        // GET: /MvcCalendar/ 

        public ActionResult Index()
        {
            return View();
        }

        // 
        // GET: /MvcCalendar/Events/ 

        public ActionResult Events(string name, int numTimes = 1)
        {
            ViewBag.Message = "Hello " + name;
            ViewBag.NumTimes = numTimes;

            return View();
        }
    }
}