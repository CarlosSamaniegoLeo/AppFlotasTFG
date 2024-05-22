using AppFlotasTFG.Service;
using System.Collections.Generic;
using System.Web.Mvc;

namespace AppFlotasTFG.Controllers
{
    public class TiposCochesController : Controller
    {
        private readonly TiposCochesService _tiposCochesService;

        public TiposCochesController()
        {
            _tiposCochesService = new TiposCochesService();
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
    }
}
