using MillionApi.Models;

namespace MillionApi.Interfaces
{
    /// <summary>
    /// Servicio para manejar automáticamente los parámetros de las peticiones HTTP
    /// </summary>
    public interface IRequestService
    {
        /// <summary>
        /// Obtiene automáticamente los parámetros de paginación de la petición actual
        /// </summary>
        ModelPaginacion? GetPaginationParameters();

        /// <summary>
        /// Obtiene un parámetro específico de la petición (query string o body)
        /// </summary>
        T GetParameter<T>(string name, T defaultValue = default(T));
    }
} 