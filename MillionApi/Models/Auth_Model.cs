using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MillionApi.Models
{
    public class Auth_Model
    {
        [Required]
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}