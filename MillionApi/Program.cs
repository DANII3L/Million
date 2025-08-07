using Microsoft.OpenApi.Models;
using MillionApi.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MillionApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ===== CONFIGURACIÓN DE SERVICIOS =====

// Configuración de JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"] ?? 
            throw new InvalidOperationException("La clave JWT (Jwt:Key) no está configurada en appsettings.json");
        
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Configuración de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MillionApi", Version = "v1" });

    // Configuración de seguridad JWT en Swagger (opcional para endpoints)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingrese el token JWT como: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // No requerir autenticación para todos los endpoints por defecto
    // Solo se aplicará a endpoints que tengan el atributo [Authorize]
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Otros servicios
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllers();
builder.Services.AddApplicationServices();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebApp",
        builder =>
        {
            builder.WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://localhost:5173",
                    "https://localhost:3000"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});
// ===== CONSTRUCCIÓN DE LA APLICACIÓN =====

var app = builder.Build();

// ===== CONFIGURACIÓN DEL PIPELINE HTTP =====

// Swagger (solo en desarrollo)
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApiRestDORA v1");
        c.RoutePrefix = string.Empty; // Esto redirige la raíz a Swagger
    });
}
else
{
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApiRestDORA v1");
        c.RoutePrefix = "swagger";
    });
}

// Middleware de infraestructura
app.UseHttpsRedirection();

// Configuración de CORS
app.UseCors("AllowWebApp");

// Middleware personalizados
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<TokenBucketRateLimitMiddleware>();
app.UseMiddleware<PaginationMiddleware>();
app.UseMiddleware<JwtValidationMiddleware>();

// Middleware de autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// Mapeo de controladores
app.MapControllers();

// Middleware de logging de seguridad
app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode >= 400)
    {
        Console.WriteLine($"Security Event: {context.Request.Path} - Status Code: {context.Response.StatusCode}");
    }
});

// ===== EJECUCIÓN =====

app.Run();
