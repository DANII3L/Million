namespace MillionApi.Models
{
    /// <summary>
    /// Modelo para manejar parámetros de paginación en consultas
    /// </summary>
    public class ModelPaginacion
    {

        /// <summary>
        /// Filtro de búsqueda
        /// </summary>
        public string? Filter { get; set; }

        public ModelPaginacion()
        {
        }

        public ModelPaginacion(string? filter = null)
        {
            Filter = filter;
        }
    }
}
