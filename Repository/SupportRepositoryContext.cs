using System;
using System.Collections.Concurrent;
using System.Data;
using System.Data.SqlClient;

namespace AppFlotasTFG.Repository
{
    public class SupportRepositoryContextFactory //: IRepositoryContextFactory
    {
        private const IsolationLevel defaultIsolationLevel = IsolationLevel.ReadCommitted;

        private readonly string _connectionString;
        private readonly ConcurrentDictionary<Guid, SupportRepositoryContext> _connections;


        public SupportRepositoryContextFactory(string connectionString)
        {
            _connectionString = connectionString;
            _connections = new ConcurrentDictionary<Guid, SupportRepositoryContext>();
        }

        public int Count
        {
            get { return _connections.Count; }
        }


        public SupportRepositoryContext Create()
        {
            Guid internalId = Guid.NewGuid();
            _connections.TryAdd(internalId, new SupportRepositoryContext(_connectionString));
            return _connections[internalId];
        }

        //public IRepositoryContext Create(string connectionString, IsolationLevel isolationLevel)
        //{
        //    Guid internalId = Guid.NewGuid();
        //    _connections.TryAdd(internalId, new RepositoryContext(internalId, connectionString, isolationLevel, () => Destory(internalId)));
        //    return _connections[internalId];
        //}

        public void Destory(Guid internalId)
        {
            if (_connections.ContainsKey(internalId))
            {
                _connections.TryRemove(internalId, out var discard);
            }
        }
    }

  

    public class SupportRepositoryContext: IDisposable
    {
        
        public SqlConnection Connection { get; private set; }

        public SqlTransaction Transaction { get; private set; }


        public SupportRepositoryContext(string connectionString)
        {
            Connection = new SqlConnection(connectionString);
            Connection.Open();
            Transaction = Connection.BeginTransaction();
        }
        public void Commit() {
            Transaction.Commit();
        }

        public void Rollback()
        {
            Transaction.Rollback();
        }


        public void Dispose()
        {
            Transaction.Dispose();            
            Connection.Close();
            Connection.Dispose();
        }
    }


}