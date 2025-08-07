using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionApi.Models
{
    public class Object_Model
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? _id { get; set; }
        public int IdOwner { get; set; }
        public string? Name { get; set; }
        public string? AddressProperty { get; set; }
        public int PriceProperty { get; set; }
        public string? ImgURL { get; set; }
    }
}