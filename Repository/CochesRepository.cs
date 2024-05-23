using AppFlotasTFG.Models;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AppFlotasTFG.Repository
{ 
    public class CochesRepository
    {
        private SupportRepositoryContextFactory contextFactory;

        public bool Insert(SupportRepositoryContext context, Coches entity)
        {
            const string execute = @"
        INSERT INTO [dbo].[Coches] (
            [Latitud],
            [Longitud],
            [Marca],
            [Modelo],
            [Año],
            [autonomiaTotal],
            [AutonomiaRestante],
            [idUsuario],
            [matricula]
        )
        VALUES (
            @Latitud,
            @Longitud,
            @Marca,
            @Modelo,
            @Año,
            @autonomiaTotal,
            @AutonomiaRestante,
            @idUsuario,
            @matricula
        );

        SELECT CAST(SCOPE_IDENTITY() AS INT)";
            try
            {
                var result = context.Connection.Query<int>(execute, entity, context.Transaction);
                entity.idCoche = result.SingleOrDefault();
                context.Commit(); // Realizar commit de la transacción
                return entity.idCoche > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        public bool Delete(SupportRepositoryContext context, Coches entity)
        {
            const string query = @"
                DELETE
                FROM [dbo].[Coches]
                WHERE [idCoche] = @idCoche";

            try
            {
                var result = context.Connection.Execute(query, entity, context.Transaction);
                context.Commit(); // Realizar commit de la transacción
                return result > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool Update(SupportRepositoryContext context, Coches entity)
        {
            const string query = @"
                UPDATE [dbo].[Coches]
                SET [Latitud] = @Latitud,
                    [Longitud] = @Longitud,
                    [Marca] = @Marca,
                    [Modelo] = @Modelo,
                    [Año] = @Año,
                    [AutonomiaTotal] = @AutonomiaTotal,
                    [AutonomiaRestante] = @AutonomiaRestante,
                    [idUsuario] = @idUsuario,
                    [matricula] = @matricula
                WHERE [idCoche] = @idCoche";
            try
            {
                var result = context.Connection.Execute(query, entity, context.Transaction);
                context.Commit(); // Realizar commit de la transacción
                return result > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public IEnumerable<Coches> SelectAll(SupportRepositoryContext context)
        {
            const string query = @"
                SELECT [idCoche],
                    [Latitud],
                    [Longitud],
                    [Marca],
                    [Modelo],
                    [Año],
                    [AutonomiaTotal],
                    [AutonomiaRestante],
                    [idUsuario],
                    [matricula]
                FROM [dbo].[Coches]";
            try
            {
                var result = context.Connection.Query<Coches>(query, null, context.Transaction);
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public Coches SelectOneById(SupportRepositoryContext context, int id)
        {
            const string query = @"
                SELECT [idCoche],
                    [Latitud],
                    [Longitud],
                    [Marca],
                    [Modelo],
                    [Año],
                    [AutonomiaTotal],
                    [AutonomiaRestante],
                    [idUsuario],
                    [matricula]
                FROM [dbo].[Coches]
                WHERE [idCoche] = @idCoche";
            try
            {
                var result = context.Connection.Query<Coches>(query, new { idUsuario = id }, context.Transaction);
                return result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public IEnumerable<Coches> SelectAllByUserId(SupportRepositoryContext context, string id)
        {
            const string query = @"
        SELECT [idCoche],
            [Latitud],
            [Longitud],
            [Marca],
            [Modelo],
            [Año],
            [AutonomiaTotal],
            [AutonomiaRestante],
            [idUsuario],
            [matricula]
        FROM [dbo].[Coches]
        WHERE [idUsuario] = @idUsuario";
            try
            {
                var result = context.Connection.Query<Coches>(query, new { idUsuario = id}, context.Transaction);
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


    }
}
