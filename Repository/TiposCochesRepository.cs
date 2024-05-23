using AppFlotasTFG.Models;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AppFlotasTFG.Repository
{
    public class TiposCochesRepository
    {
        public IEnumerable<string> ObtenerMarcas(SupportRepositoryContext context)
        {
            const string query = @"
                SELECT DISTINCT [Marca]
                FROM [dbo].[TiposCoches]";
            try
            {
                var result = context.Connection.Query<string>(query, null, context.Transaction);
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<string> ObtenerModelosPorMarca(SupportRepositoryContext context, string marca)
        {
            const string query = @"
                SELECT [Modelo]
                FROM [dbo].[TiposCoches]
                WHERE [Marca] = @Marca";
            try
            {
                var result = context.Connection.Query<string>(query, new { Marca = marca }, context.Transaction);
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
