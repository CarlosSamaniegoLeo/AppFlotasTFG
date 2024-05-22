using AppFlotasTFG.Models;
using AppFlotasTFG.Repository;
using Support.Data.Access;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace AppFlotasTFG.Service
{
    public class UsuarioService
    {
        private readonly UsuariosRepository _repository;
        private readonly SupportRepositoryContextFactory _factoryRepositoryContextTFGflotas;

        public UsuarioService()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["Flotas"].ConnectionString;
            _factoryRepositoryContextTFGflotas = new SupportRepositoryContextFactory(connectionString);

            _repository = new UsuariosRepository();
        }

        public IEnumerable<Usuarios> GetAllUser()
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.SelectAll(context);
            }
        }

        public Usuarios GetUserById(int id)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.SelectOneById(context, id);
            }
        }

        public Usuarios GetUserByCorreo(string correoVar)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                return _repository.SelectOneByCorreo(context, correoVar);
            }
        }

        public bool SaveUser(Usuarios usuarios)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                try
                {
                    if (usuarios.idUsuario > 0)
                    {
                        return _repository.Update(context, usuarios);
                    }
                    else
                    {
                        return _repository.Insert(context, usuarios);
                    }
                }
                catch (Exception ex)
                {
                    // Manejar la excepción
                    return false;
                }
            }
        }

        public bool SaveVerifiedUser(string correo, string contraseña)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                try
                {
                    // Cifra la contraseña
                    string contraseñaCifrada = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(contraseña));

                    // Crea un nuevo usuario con los datos proporcionados
                    var nuevoUsuario = new Usuarios
                    {
                        correo = correo,
                        contraseña = contraseñaCifrada
                    };

                    return _repository.Insert(context, nuevoUsuario);
                }
                catch (Exception ex)
                {
                    // Manejar la excepción
                    return false;
                }
            }
        }

        public bool DeleteUser(int id)
        {
            using (var context = _factoryRepositoryContextTFGflotas.Create())
            {
                try
                {
                    var usuario = _repository.SelectOneById(context, id);
                    if (usuario != null)
                    {
                        return _repository.Delete(context, usuario);
                    }
                    return false;
                }
                catch (Exception ex)
                {
                    // Manejar la excepción
                    return false;
                }
            }
        }
    }
}
