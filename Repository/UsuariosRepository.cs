using AppFlotasTFG.Models;
using Dapper;
using AppFlotasTFG.Repository;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Support.Data.Access
{
    public class UsuariosRepository
    {
        public bool Insert(SupportRepositoryContext context, Usuarios entity)
        {
            const string execute = @"
                INSERT INTO [dbo].[Usuarios] (
                    [correo],
                    [contraseña]
                )
                VALUES (
                    @correo,
                    @contraseña
                );

                SELECT CAST(SCOPE_IDENTITY() AS INT)";
            try
            {
                var result = context.Connection.Query<int>(execute, entity, context.Transaction);
                entity.idUsuario = result.SingleOrDefault();
                return entity.idUsuario > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool Delete(SupportRepositoryContext context, Usuarios entity)
        {
            const string query = @"
                DELETE
                FROM [dbo].[Usuarios]
                WHERE [idUsuario] = @idUsuario";

            try
            {
                var result = context.Connection.Execute(query, entity, context.Transaction);
                return result > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool Update(SupportRepositoryContext context, Usuarios entity)
        {
            const string query = @"
                UPDATE [dbo].[Usuarios]
                SET [correo] = @correo,
                    [contraseña] = @contraseña
                WHERE [idUsuario] = @idUsuario";
            try
            {
                var result = context.Connection.Execute(query, entity, context.Transaction);
                return result > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public IEnumerable<Usuarios> SelectAll(SupportRepositoryContext context)
        {
            const string query = @"
                SELECT [idUsuario],
                    [correo],
                    [contraseña]
                FROM [dbo].[Usuarios]";
            try
            {
                var result = context.Connection.Query<Usuarios>(query, null, context.Transaction);
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public Usuarios SelectOneById(SupportRepositoryContext context, int id)
        {
            const string query = @"
                SELECT [idUsuario],
                    [correo],
                    [contraseña]
                FROM [dbo].[Usuarios]
                WHERE [idUsuario] = @idUsuario";
            try
            {
                var result = context.Connection.Query<Usuarios>(query, new { idUsuario = id }, context.Transaction);
                return result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public Usuarios SelectOneByCorreo(SupportRepositoryContext context, string correoVar)
        {
            const string query = @"
                SELECT [idUsuario],
                    [correo],
                    [contraseña]
                FROM [dbo].[Usuarios]
                WHERE [correo] = @correo";
            try
            {
                var result = context.Connection.Query<Usuarios>(query, new { correo = correoVar }, context.Transaction);
                return result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
