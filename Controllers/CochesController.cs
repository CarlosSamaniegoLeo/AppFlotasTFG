using System.Web.Mvc;
using AppFlotasTFG.Models;
using AppFlotasTFG.Service;

namespace AppFlotasTFG.Controllers
{
    public class CochesController : Controller
    {
        private readonly CochesService _cochesService;

        public CochesController()
        {
            _cochesService = new CochesService();
        }

        public ActionResult Index()
        {
            var coches = _cochesService.GetAllCoches();
            return View("Vehiculos", coches);
        }

        // Otros métodos del controlador para manejar CRUD
    }
}
