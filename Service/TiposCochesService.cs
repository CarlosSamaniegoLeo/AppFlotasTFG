using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using AppFlotasTFG.Models;
using AppFlotasTFG.Repository;

namespace AppFlotasTFG.Service
{
    public class TiposCochesService
    {
        private readonly TiposCochesRepository _repository;
        private readonly SupportRepositoryContextFactory _factoryRepositoryContextTFGflotas;

        public TiposCochesService()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["Flotas"].ConnectionString;
            _factoryRepositoryContextTFGflotas = new SupportRepositoryContextFactory(connectionString);

            _repository = new TiposCochesRepository();
        }

        public IEnumerable<string> GetAllMarcas()
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.ObtenerMarcas(context);
            }
        }

        public IEnumerable<string> GetModelosByMarca(string marca)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.ObtenerModelosPorMarca(context, marca);
            }
        }
    }
}
