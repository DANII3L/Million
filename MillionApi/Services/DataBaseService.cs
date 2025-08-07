using MillionApi.Interfaces;
using MillionApi.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Reflection;
using MongoDB.Bson.Serialization;

namespace MillionApi.Services
{
    public class DataBaseService : IDataBase
    {
        private readonly IMongoDatabase _database;
        private readonly IRequestService _requestService;

        public DataBaseService(IConfiguration configuration, IRequestService requestService)
        {
            var connectionString = configuration.GetConnectionString("MongoDB") ?? 
                throw new InvalidOperationException("La cadena de conexión MongoDB no está configurada");
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase("MillionDB");
            _requestService = requestService;
        }

        /// <summary>
        /// Ejecuta una consulta en MongoDB con filtros combinados
        /// </summary>
        public async Task<MongoResult<IEnumerable<TResult>>> EjecutarConsultaAsync<TResult>(MongoParameters parameters) where TResult : new()
        {
            try
            {
                var modelPaginacion = _requestService.GetPaginationParameters();
                var collection = _database.GetCollection<BsonDocument>(parameters.CollectionName);
                
                // Construir filtro combinado usando ambos filtros
                var combinedFilter = BuildFilter(parameters.Filter, modelPaginacion?.Filter);
                
                var query = collection.Find(combinedFilter);

                var documents = await query.ToListAsync();
                
                // Usar ObjectResponse_Model para consultas que devuelven _id
                var result = new MongoResult<IEnumerable<TResult>>
                {
                    Data = documents.Any() ? ConvertBsonDocumentsToType<TResult>(documents) : Enumerable.Empty<TResult>(),
                    TotalRecords = documents.Count,
                    IsSuccess = true,
                    Message = "Operación exitosa"
                };

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en consulta: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return MongoResult<IEnumerable<TResult>>.Failure(ex);
            }
        }

        
        #region Métodos privados optimizados

        private FilterDefinition<BsonDocument> BuildFilter(string filter, string filter2 = null)
        {
            var filters = new List<FilterDefinition<BsonDocument>>();
            
            // Procesar primer filtro
            if (!string.IsNullOrEmpty(filter))
            {
                try
                {
                    var bsonDoc = BsonDocument.Parse(filter);
                    foreach (var element in bsonDoc)
                    {
                        var fieldFilter = Builders<BsonDocument>.Filter.Eq(element.Name, element.Value);
                        filters.Add(fieldFilter);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error construyendo filtro 1: {ex.Message}");
                }
            }
            
            // Procesar segundo filtro
            if (!string.IsNullOrEmpty(filter2))
            {
                try
                {
                    var bsonDoc2 = BsonDocument.Parse(filter2);
                    foreach (var element in bsonDoc2)
                    {
                        var fieldFilter = Builders<BsonDocument>.Filter.Eq(element.Name, element.Value);
                        filters.Add(fieldFilter);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error construyendo filtro 2: {ex.Message}");
                }
            }
            
            // Combinar todos los filtros con AND
            if (filters.Count == 0)
                return Builders<BsonDocument>.Filter.Empty;
            else if (filters.Count == 1)
                return filters[0];
            else
                return Builders<BsonDocument>.Filter.And(filters);
        }

        private IEnumerable<TResult> ConvertBsonDocumentsToType<TResult>(List<BsonDocument> documents) where TResult : new()
        {
            var properties = typeof(TResult).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            
            return documents.Select(doc =>
            {
                var item = new TResult();
                foreach (var prop in properties)
                {
                    if (doc.Contains(prop.Name))
                    {
                        var value = doc[prop.Name];
                        var convertedValue = ConvertBsonValueToType(value, prop.PropertyType);
                        prop.SetValue(item, convertedValue);
                    }
                }
                return item;
            });
        }

        private object ConvertBsonValueToType(BsonValue bsonValue, Type targetType)
        {
            if (bsonValue.IsBsonNull)
                return null;

            // Manejo especial para ObjectId
            if (bsonValue.IsObjectId)
            {
                return bsonValue.AsObjectId.ToString();
            }

            return targetType.Name switch
            {
                nameof(String) => bsonValue.AsString,
                nameof(Int32) => bsonValue.AsInt32,
                nameof(Int64) => bsonValue.AsInt64,
                nameof(Double) => bsonValue.AsDouble,
                nameof(Boolean) => bsonValue.AsBoolean,
                nameof(DateTime) => bsonValue.ToUniversalTime(),
                nameof(Guid) => Guid.Parse(bsonValue.AsString),
                _ => bsonValue.ToString()
            };
        }

        #endregion
    }
}