using MillionApi.Interfaces;
using MillionApi.Models;

namespace MillionApi.Services
{
    /// <summary>
    /// Servicio para manejar automáticamente los parámetros de las peticiones HTTP
    /// </summary>
    public class RequestService : IRequestService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequestService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public ModelPaginacion? GetPaginationParameters()
        {
            var filter = GetParameter("filter", "");

            var result = new ModelPaginacion
            {
                Filter = filter
            };

            return result;
        }

        public T GetParameter<T>(string name, T defaultValue = default(T))
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
                return defaultValue;

            // 1. Query string
            var queryValue = context.Request.Query[name].ToString();
            if (!string.IsNullOrEmpty(queryValue))
            {
                try
                {
                    return (T)ChangeTypeNullable(queryValue, typeof(T));
                }
                catch { }
            }

            // 2. Route values
            if (context.Request.RouteValues.TryGetValue(name, out var routeValue) && routeValue != null)
            {
                try
                {
                    return (T)ChangeTypeNullable(routeValue.ToString(), typeof(T));
                }
                catch { }
            }

            return defaultValue;
        }

        // Método auxiliar para soportar conversiones a tipos nullable
        private static object ChangeTypeNullable(object value, Type conversionType)
        {
            if (conversionType == null)
                throw new ArgumentNullException(nameof(conversionType));

            if (conversionType.IsGenericType && conversionType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                if (value == null)
                    return null;
                conversionType = Nullable.GetUnderlyingType(conversionType);
            }
            return Convert.ChangeType(value, conversionType);
        }
    }
} 