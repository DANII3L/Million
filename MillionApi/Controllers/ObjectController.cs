using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MillionApi.Interfaces;

namespace MillionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ObjectController : BaseApiController
    {
        private readonly IObject _objectService;

        public ObjectController(IObject objectService)
        {
            _objectService = objectService;
        }

        [HttpGet("get")]
        public async Task<IActionResult> Get()
        {
            try
            {
                
                var result = await _objectService.GetAsync();
                
                return OkResponse(result, "Objeto obtenido correctamente");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en ObjectController: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return BadRequestResponse(ex.Message);
            }
        }
    }
}