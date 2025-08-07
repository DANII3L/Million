using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MillionApi.Interfaces;
using MillionApi.Models;

namespace MillionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : BaseApiController
    {
        private readonly IAuth _authService;

        public AuthController(IAuth authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] Auth_Model auth_Model)
        {
            if(auth_Model.Username is null || auth_Model.Password is null)
                return UnauthorizedResponse("Credenciales inválidas");

            var (success, token, user) = await _authService.LoginAsync(auth_Model);
            if (!success)   
                return UnauthorizedResponse("Credenciales inválidas");

            return OkResponse(new { token, user }, "Inicio de sesión exitoso");
        }
    }
}