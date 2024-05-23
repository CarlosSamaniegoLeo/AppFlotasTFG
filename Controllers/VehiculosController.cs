using AppFlotasTFG.Models;
using AppFlotasTFG.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppFlotasTFG.Controllers
{
    public class VehiculosController : Controller
    {
        private readonly CochesService _cochesService;
        private readonly TiposCochesService _tiposCochesService;

        public VehiculosController()
        {
            _cochesService = new CochesService();
            _tiposCochesService = new TiposCochesService();
        }

        public ActionResult Index()
        {
            var coches = _cochesService.GetAllCoches();
            return View("Vehiculos", coches);
        }

        // Método para obtener todas las marcas de coches
        [HttpGet]
        public JsonResult Marcas()
        {
            IEnumerable<string> marcas = _tiposCochesService.GetAllMarcas();
            return Json(marcas, JsonRequestBehavior.AllowGet);
        }

        // Método para obtener los modelos de coches según la marca seleccionada
        [HttpGet]
        public JsonResult ModelosPorMarca(string marca)
        {
            IEnumerable<string> modelos = _tiposCochesService.GetModelosByMarca(marca);
            return Json(modelos, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllCoches()
        {
            var coches = _cochesService.GetAllCoches();
            return Json(coches, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCochesPorUsuario(string idUsuario)
        {
            var coches = _cochesService.GetCochesByUserId(idUsuario);
            return Json(coches, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetOneCochesbyId(int id)
        {
            var coches = _cochesService.GetCocheById(id);
            return Json(coches, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteCoches(List<int> ids)
        {
            // Verificar si se proporcionaron IDs válidos
            if (ids == null || ids.Count == 0)
            {
                return Json(new { success = false, message = "No se proporcionaron IDs válidos para eliminar." });
            }

            try
            {
                // Iterar sobre cada ID y eliminar el coche correspondiente
                foreach (var id in ids)
                {
                    _cochesService.DeleteCoche(id); // Pasar el ID directamente al método DeleteCoche
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al eliminar coche(s)." });
            }
        }


        [HttpPost]
        public JsonResult CrearCoche(Coches nuevoCoche)
        {

            // Intentar guardar el nuevo coche usando el servicio
            if (_cochesService.SaveCoche(nuevoCoche))
            {
                return Json(new { success = true });
            }
            else
            {
                return Json(new { success = false, message = "Error al crear el coche." });
            }
        }
        


    }
}