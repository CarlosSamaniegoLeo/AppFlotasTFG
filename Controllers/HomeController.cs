using System.Web.Mvc;
using AppFlotasTFG.Models;
using AppFlotasTFG.Service;

namespace AppFlotasTFG.Controllers
{
    public class HomeController : Controller
    {
        private readonly UsuarioService _usuariosService;

        public HomeController()
        {
            _usuariosService = new UsuarioService();
        }

        public ActionResult Index()
        {
            return View("Login"); // Cargar la vista de inicio de sesión por defecto
        }

        public JsonResult GetAllUserbyId(string correo)
        {
            var coches = _usuariosService.GetUserByCorreo(correo);
            return Json(coches, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CheckEmail(string correo)
        {
            var usuario = _usuariosService.GetUserByCorreo(correo);
            bool exists = usuario != null;
            return Json(new { exists }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult VerifyCredentials(string correo, string contraseña)
        {
            var usuario = _usuariosService.GetUserByCorreo(correo);
            bool isValid = usuario != null && usuario.contraseña == contraseña;
            return Json(new { isValid }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateUser(Usuarios usuario)
        {
            bool success = _usuariosService.SaveUser(usuario);
            return Json(new { success });
        }
        [HttpPost]
        public JsonResult CreateVerifiedUser(string correo, string contraseña)
        {
            bool success = _usuariosService.SaveVerifiedUser(correo, contraseña);
            return Json(new { success });
        }

    }
}
