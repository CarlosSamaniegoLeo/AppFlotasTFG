using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using AppFlotasTFG.Models;
using AppFlotasTFG.Repository;

namespace AppFlotasTFG.Service
{
    public class CochesService
    {
        private readonly CochesRepository _repository;
        private readonly SupportRepositoryContextFactory _factoryRepositoryContextTFGflotas;

        public CochesService()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["Flotas"].ConnectionString;
            _factoryRepositoryContextTFGflotas = new SupportRepositoryContextFactory(connectionString);

            _repository = new CochesRepository();
        }

        public IEnumerable<Coches> GetAllCoches()
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.SelectAll(context);
            }
        }

        public Coches GetCocheById(int id)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.SelectOneById(context, id);
            }
        }

        public bool SaveCoche(Coches coche)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                try
                {
                    if (coche.idCoche > 0)
                    {
                        return _repository.Update(context, coche);
                    }
                    else
                    {
                        return _repository.Insert(context, coche);
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public bool DeleteCoche(int id)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                try
                {
                    return _repository.Delete(context, new Coches { idCoche = id });
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public IEnumerable<Coches> GetCochesByUserId(string idUsuario)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                var coches = _repository.SelectAllByUserId(context, idUsuario);
                return coches ?? Enumerable.Empty<Coches>(); // Devolver una lista vacía si no hay vehículos asociados
            }
        }


    }
}