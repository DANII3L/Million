using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using MillionApi.Interfaces;
using MillionApi.Models;

namespace MillionApi.Services
{
    public class AuthService : IAuth
    {

        private readonly IDataBase _dataBase;
        private readonly IConfiguration _configuration;

        public AuthService(IDataBase dataBase, IConfiguration configuration){
            _dataBase = dataBase;
            _configuration = configuration;
        }

        public async Task<(bool success, string? token, Auth_Model? user)> LoginAsync(Auth_Model auth_Model)
        {
            var parameters = new MongoParameters("users", $"{{ \"username\": \"{auth_Model.Username}\", \"password\": \"{auth_Model.Password}\" }}");

            var authResponse = await _dataBase.EjecutarConsultaAsync<Auth_Model>(parameters);

            if (authResponse.Data.Count() == 0)
                return (false, null, null);

            var token = GenerateJwtToken(auth_Model);

            auth_Model.Password = "";

            return (true, token, auth_Model);
        }

        private string GenerateJwtToken(Auth_Model auth_Model)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key no está configurada");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, auth_Model.Username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}