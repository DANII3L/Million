using System.Net;
using System.Text.Json;
using System.Collections.Concurrent;

namespace MillionApi.Security
{
    /// <summary>
    /// Middleware global para el manejo de excepciones en la API.
    /// Captura cualquier excepción no manejada y devuelve una respuesta JSON estándar.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        /// <summary>
        /// Constructor del middleware de excepciones.
        /// </summary>
        /// <param name="next">El siguiente middleware en la cadena.</param>
        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Método principal que intercepta la petición HTTP y maneja excepciones globalmente.
        /// </summary>
        /// <param name="context">Contexto HTTP.</param>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Maneja la excepción y devuelve una respuesta JSON con el código de estado adecuado.
        /// </summary>
        /// <param name="context">Contexto HTTP.</param>
        /// <param name="exception">Excepción capturada.</param>
        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;

            // Personaliza el código de estado según el tipo de excepción
            if (exception is KeyNotFoundException)
                code = HttpStatusCode.NotFound;
            else if (exception is ArgumentException || exception is ArgumentNullException)
                code = HttpStatusCode.BadRequest;

            var result = JsonSerializer.Serialize(new
            {
                error = exception.Message,
                status = (int)code
            });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }

    /// <summary>
    /// Middleware que implementa el algoritmo Token Bucket para limitar la tasa de peticiones.
    /// Permite ráfagas de peticiones y recarga tokens a un ritmo fijo.
    /// </summary>
    public class TokenBucketRateLimitMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, (int Tokens, DateTime LastRefill)> _buckets = new();

        private readonly int _capacity = 100; // Aumentado para ser más realista
        private readonly int _refillRate = 10; // tokens por segundo

        /// <summary>
        /// Constructor del middleware Token Bucket.
        /// </summary>
        /// <param name="next">El siguiente middleware en la cadena.</param>
        public TokenBucketRateLimitMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Intercepta la petición y aplica el algoritmo Token Bucket.
        /// </summary>
        /// <param name="context">Contexto HTTP.</param>
        public async Task InvokeAsync(HttpContext context)
        {
            var key = context.Connection.RemoteIpAddress?.ToString() ?? "global";
            var now = DateTime.UtcNow;

            var (tokens, lastRefill) = _buckets.GetOrAdd(key, (_capacity, now));
            var secondsSinceLast = (now - lastRefill).TotalSeconds;
            var tokensToAdd = (int)(secondsSinceLast * _refillRate);

            tokens = Math.Min(_capacity, tokens + tokensToAdd);
            lastRefill = tokensToAdd > 0 ? now : lastRefill;

            if (tokens > 0)
            {
                tokens--;
                _buckets[key] = (tokens, lastRefill);
                await _next(context);
            }
            else
            {
                _buckets[key] = (tokens, lastRefill);
                context.Response.StatusCode = 429;
                await context.Response.WriteAsync("Rate limit exceeded");
            }
        }
    }
}
