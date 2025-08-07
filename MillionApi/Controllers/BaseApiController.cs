using MillionApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace MillionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected IActionResult OkResponse<T>(T data, string message = "Operación exitosa")
        {
            return Ok(new ApiResponse<T> { Success = true, Data = data, Message = message });
        }

        protected IActionResult OkResponse(string message)
        {
            return Ok(new ApiResponse<object> { Success = true, Message = message });
        }

        protected IActionResult NotFoundResponse(string message)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = message });
        }

        protected IActionResult BadRequestResponse(string message)
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = message });
        }
         protected IActionResult UnauthorizedResponse(string message)
        {
            return Unauthorized(new ApiResponse<object> { Success = false, Message = message });
        }
    }
} 