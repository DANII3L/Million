import React, { useState } from 'react';

interface LogoProps {
  imageSrc?: string;
  fallbackText?: string;
  alt?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  imageSrc = "/images/logo.png",
  fallbackText = "M",
  alt = "Million Logo",
  className = ""
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="w-16 h-16 flex items-center justify-center">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-contain drop-shadow-2xl transition-all duration-300 hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <div className="text-5xl font-gaming text-white drop-shadow-2xl tracking-wider">
            {fallbackText}
          </div>
        )}
      </div>
      <div className="text-white font-gaming-secondary drop-shadow-lg text-lg">
        MILLION
      </div>
    </div>
  );
};

export default Logo; 