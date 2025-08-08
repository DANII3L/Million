import React from "react";

// Props opcionales para futuras funcionalidades de video
interface HeroSectionProps {
  videoRef?: React.RefObject<HTMLElement>;
  isVideoVisible?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = () => {

  return (
    <>
      {/* Sección principal del hero - Ocupa toda la altura disponible del contenedor padre */}
      {/* h-full: Altura completa del contenedor padre (en lugar de min-h-screen) */}
      {/* flex items-center justify-center: Centra el contenido vertical y horizontalmente */}
      <section
        id="inicio"
        className="relative h-full flex items-center justify-center"
      >
        {/* Fondo con gradiente oscuro que cubre toda la sección */}
        {/* absolute inset-0: Posiciona el fondo para cubrir toda la sección */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(26, 46, 41, 0.8) 0%, rgba(45, 79, 74, 0.8) 100%)`
          }}
        ></div>
        
        {/* Contenido principal centrado */}
        {/* relative z-8: Posiciona el contenido por encima del fondo */}
        <div className="relative z-8 text-center text-white">
          {/* Título principal - Responsive para diferentes tamaños de pantalla */}
          {/* text-6xl md:text-8xl: Más pequeño en móviles, más grande en pantallas medianas+ */}
          {/* mb-6: Margen inferior reducido para optimizar espacio vertical */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 font-friendly" style={{ letterSpacing: "0.02em" }}>
            MILLION
          </h1>
          
          {/* Subtítulo - También responsive */}
          {/* text-xl md:text-2xl: Tamaño responsive para mejor adaptación */}
          {/* mb-8: Margen inferior optimizado para el layout de una sola pantalla */}
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-white font-medium mb-8">
            Proyecto de admisión
          </p>
        </div>
      </section>
    </>
  );
};

export default HeroSection;