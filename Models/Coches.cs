using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppFlotasTFG.Models
{
    public class Coches
    {
        public int idCoche { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public int Año { get; set; }
        public int AutonomiaTotal { get; set; }
        public int AutonomiaRestante { get; set; }
        public string idUsuario { get; set; }
        public string Matricula { get; set; }
    }
}
