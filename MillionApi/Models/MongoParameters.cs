using MillionApi.Models;

/// <summary>
/// Parámetros para consultas dinámicas en MongoDB
/// </summary>
public class MongoParameters
    {
        public string CollectionName { get; set; }
        public string Filter { get; set; }
        public string Sort { get; set; }

        public MongoParameters(string collectionName, string filter = null, string sort = null)
        {
            CollectionName = collectionName;
            Filter = filter;
            Sort = sort;
        }
    }