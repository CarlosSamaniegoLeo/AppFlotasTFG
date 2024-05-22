using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AppFlotasTFG
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
            name: "Map",
            url: "Map",
            defaults: new { controller = "Map", action = "Index" }
        );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
           routes.MapRoute(
                name: "Perfil",
                url: "Perfil",
                defaults: new { controller = "Perfil", action = "Index" }
            );routes.MapRoute(
                name: "Vehiculos",
                url: "Vehiculos",
                defaults: new { controller = "Vehiculos", action = "Index" }
            );
            routes.MapRoute(
                name: "VehiculosMarca",
                url: "Vehiculos",
                defaults: new { controller = "Vehiculos", action = "Marcas" }
            );
            routes.MapRoute(
                name: "VehiculosModelo",
                url: "Vehiculos",
                defaults: new { controller = "Vehiculos", action = "ModelosPorMarca" }
            );
        }


    }
}
