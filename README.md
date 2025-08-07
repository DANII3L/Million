# 🏠 Million Project

Sistema de gestión inmobiliaria completo con API REST y frontend React.

## 📋 Descripción

Million Project es una aplicación web moderna para la gestión de propiedades inmobiliarias, construida con tecnologías de vanguardia:

## 🚀 Características

### Backend (API)
- ✅ API REST con ASP.NET Core 9.0
- ✅ Autenticación JWT
- ✅ Base de datos MongoDB
- ✅ Middleware personalizado
- ✅ Swagger UI para documentación
- ✅ CORS configurado
- ✅ Manejo de errores centralizado

### Frontend (React)
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Autenticación con JWT
- ✅ Componentes reutilizables
- ✅ Modal de detalles de propiedades
- ✅ Filtros dinámicos
- ✅ Diseño responsive
- ✅ Glassmorphism UI

## 📁 Estructura del Proyecto

```
Million-Project/
├── MillionApi/                 # Backend ASP.NET Core
│   ├── Controllers/           # Controladores API
│   ├── Services/              # Servicios de negocio
│   ├── Models/                # Modelos de datos
│   ├── Interfaces/            # Interfaces
│   ├── Extensions/            # Extensiones
│   └── Security/              # Middleware de seguridad
├── MillionFrontend/           # Frontend React
│   └── project/
│       ├── src/
│       │   ├── app/
│       │   │   ├── auth/      # Autenticación
│       │   │   ├── propiedades/ # Gestión de propiedades
│       │   │   ├── landing/   # Página principal
│       │   │   └── shared/    # Componentes compartidos
│       │   └── main.tsx
│       └── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **ASP.NET Core 9.0**: Framework web
- **MongoDB.Driver**: Cliente de MongoDB
- **JWT**: Autenticación
- **Swagger**: Documentación API
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework CSS
- **Lucide React**: Iconos
- **Axios**: Cliente HTTP
- **React Router**: Navegación

## 🚀 Instalación y Configuración

### Prerrequisitos
- .NET 9.0 SDK
- Node.js 18+
- MongoDB Atlas (cuenta gratuita)

### Backend
```bash
cd MillionApi
dotnet restore
dotnet run
```

### Frontend
```bash
cd MillionFrontend/project
npm install
npm run dev
```

## 🔧 Configuración

## 📖 Uso

1. **Iniciar sesión**: Usar credenciales de administrador
2. **Ver propiedades**: Lista de todas las propiedades
3. **Filtrar**: Búsqueda por nombre, dirección o precio
4. **Ver detalles**: Modal con información completa
5. **Cerrar sesión**: Botón en el menú

## 🔐 Autenticación

- **Login**: `/api/Auth/login`
- **JWT**: Tokens de acceso
- **Middleware**: Validación automática
- **CORS**: Configurado para desarrollo

## 📊 Base de Datos

## 🎨 Características de UI

- **Glassmorphism**: Efectos de cristal
- **Responsive**: Adaptable a móviles
- **Dark Theme**: Tema oscuro moderno
- **Animaciones**: Transiciones suaves
- **Modales**: Información detallada

## 🔄 API Endpoints

### Autenticación
- `POST /api/Auth/login` - Iniciar sesión

### Propiedades
- `GET /api/Object/get` - Obtener todas las propiedades
- `GET /api/Object/get?Filter={...}` - Filtrar propiedades

## 📝 Licencia

Este proyecto es de uso educativo y personal.

## 👨‍💻 Autor

Daniel Martín - 2025

---

**¡Disfruta usando Million Project!** 🏠✨
