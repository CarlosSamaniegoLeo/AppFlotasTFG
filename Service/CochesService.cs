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
                    // Manejar la excepción
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
                    // No necesitas recuperar el coche completo para eliminarlo, solo el ID es suficiente
                    return _repository.Delete(context, new Coches { idCoche = id });
                }
                catch (Exception ex)
                {
                    // Manejar la excepción
                    return false;
                }
            }
        }

        public IEnumerable<Coches> GetCochesByUserId(int idUsuario)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.SelectAllByUserId(context, idUsuario);
            }
        }
    }
}