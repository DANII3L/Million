using MillionApi.Services;
using MillionApi.Interfaces;

namespace MillionApi.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {   
            // Registrar HttpContextAccessor para acceder al contexto HTTP
            services.AddHttpContextAccessor();

            // Registrar el servicio de manejo de peticiones
            services.AddScoped<IRequestService, RequestService>();

            services.AddTransient<IAuth, AuthService>();
            services.AddTransient<IObject, ObjectService>();
            services.AddScoped<IDataBase, DataBaseService>();

            return services;
        }
    }
} 