using System.Text.Json;

namespace MillionApi.Security
{
    /// <summary>
    /// Middleware que extrae automáticamente parámetros de paginación del body JSON de peticiones POST
    /// </summary>
    public class PaginationMiddleware
    {
        private readonly RequestDelegate _next;

        public PaginationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Solo procesar si es POST o PUT
            if (context.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
                context.Request.Method.Equals("PUT", StringComparison.OrdinalIgnoreCase))
            {
                await ExtractPaginationFromBody(context);
            }

            await _next(context);
        }

        private async Task ExtractPaginationFromBody(HttpContext context)
        {
            try
            {
                // Habilitar buffering para poder leer el body múltiples veces
                context.Request.EnableBuffering();
                
                // Leer el body
                using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
                var bodyContent = await reader.ReadToEndAsync();

                if (!string.IsNullOrEmpty(bodyContent))
                {
                    var jsonDoc = JsonDocument.Parse(bodyContent);
                    var root = jsonDoc.RootElement;

                    // Extraer parámetros de paginación si existen
                    string? filter = null;

                    if (root.TryGetProperty("filter", out var filterProp) && 
                        filterProp.ValueKind == JsonValueKind.String)
                    {
                        filter = filterProp.GetString();
                    }

                    // Si se encontraron parámetros de paginación, agregarlos al QueryString
                    if (!string.IsNullOrEmpty(filter))
                    {
                        var queryBuilder = new QueryString();
                        
                        if (!string.IsNullOrEmpty(filter))
                        {
                            queryBuilder = queryBuilder.Add("filter", filter);
                        }
                        
                        // Combinar con query existente
                        var existingQuery = context.Request.QueryString;
                        var newQuery = existingQuery.HasValue ? 
                            existingQuery.Value + "&" + queryBuilder.Value?.TrimStart('?') : 
                            queryBuilder.Value;
                        
                        context.Request.QueryString = new QueryString(newQuery);
                    }
                }

                // Resetear la posición del body para que otros middlewares puedan leerlo
                context.Request.Body.Position = 0;
            }
            catch
            {
                // En caso de error, resetear la posición del body
                context.Request.Body.Position = 0;
            }
        }
    }
} 