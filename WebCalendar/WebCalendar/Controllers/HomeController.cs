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
            var model = _context.procWebGetEvent(date).ToList();

            return Json(new { success = true, result = model }, JsonRequestBehavior.AllowGet);
        }
    }
}