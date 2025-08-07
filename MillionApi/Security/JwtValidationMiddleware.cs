using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace MillionApi.Security
{
    /// <summary>
    /// Middleware para validar la presencia del token JWT y devolver mensajes personalizados
    /// </summary>
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Rutas que no requieren autenticación
            var publicPaths = new[]
            {
                "/swagger",
                "/swagger/v1/swagger.json",
                "/swagger/index.html",
                "/favicon.ico",
                "/health",
                "/health/ready",
                "/health/live"
            };

            var path = context.Request.Path.Value?.ToLower();
            
            // Si es una ruta pública, continuar sin validación
            if (path != null && publicPaths.Any(publicPath => path.StartsWith(publicPath.ToLower())))
            {
                await _next(context);
                return;
            }

            var endpoint = context.GetEndpoint();
            if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
            {
                // El endpoint está marcado con [AllowAnonymous], así que nos saltamos la validación.
                try{
                    await _next(context);
                }
                catch (SecurityTokenExpiredException)
                {
                    await HandleMissingToken(context, "Token expirado");
                }
                catch (SecurityTokenInvalidSignatureException)
                {
                    await HandleMissingToken(context, "Token inválido: firma incorrecta");
                }
                catch (SecurityTokenInvalidIssuerException)
                {
                    await HandleMissingToken(context, "Token inválido: emisor incorrecto");
                }
                catch (SecurityTokenInvalidAudienceException)
                {
                    await HandleMissingToken(context, "Token inválido: audiencia incorrecta");
                }
                catch (SecurityTokenException)
                {
                    await HandleMissingToken(context, "Token inválido");
                }
                return;
            }

            // Busca el token en el encabezado Authorization: Bearer <token>
            var authHeader = context.Request.Headers["Authorization"].ToString();
            
            if (string.IsNullOrWhiteSpace(authHeader))
            {
                await HandleMissingToken(context, "No autorizado: token no proporcionado");
                return;
            }

            if (!authHeader.StartsWith("Bearer "))
            {
                await HandleMissingToken(context, "No autorizado: formato de token incorrecto. Use 'Bearer <token>'");
                return;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            
            if (string.IsNullOrWhiteSpace(token))
            {
                await HandleMissingToken(context, "No autorizado: token no proporcionado");
                return;
            }

            // Si el token está presente y tiene el formato correcto, continúa con la cadena de middlewares
            // La validación real del JWT la hará el middleware de autenticación de ASP.NET Core
            await _next(context);
        }

        private async Task HandleMissingToken(HttpContext context, string message)
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";

            var errorResponse = new
            {
                success = false,
                message = message,
                statusCode = 401
            };

            var jsonResponse = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(jsonResponse);
        }
    }
} 