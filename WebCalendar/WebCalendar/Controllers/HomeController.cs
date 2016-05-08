using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Management;
using System.Web.Mvc;
using WebCalendar.Models;

namespace WebCalendar.Controllers
{
    public class HomeController : Controller
    {
        private SpecialEventsEntities _context;

        public HomeController()
        {
            _context = new SpecialEventsEntities();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult SECalendar()
        {
            ViewBag.Message = "Special Events Calendar";

            return View();
        }

        [HttpGet]
        public JsonResult GetSpecialEvents(DateTime date)
        {
            DateTime today = DateTime.Today;
            int lastDayOfMonth = DateTime.DaysInMonth(date.Year, date.Month);
            IList<procWebGetEvent_Result>[] monthlyEventsList = new IList<procWebGetEvent_Result>[lastDayOfMonth];
            for (int day = 1; day <= lastDayOfMonth; day++)
            {
                // build the cell for this date
                DateTime thisDate = new DateTime(date.Year, date.Month, day);
                monthlyEventsList[day - 1] = _context.procWebGetEvent(thisDate).ToList();
            }

            var model = monthlyEventsList;
            return Json(new { success = true, result = model }, JsonRequestBehavior.AllowGet);
        }

    }
}