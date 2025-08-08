import React from 'react';
import { X, HomeIcon, MapPinIcon, CurrencyIcon, UserIcon } from 'lucide-react';
import { Propiedad } from '../models/Propiedad';

interface DetallesModalProps {
  isOpen: boolean;
  onClose: () => void;
  propiedad: Propiedad | null;
}

const DetallesModal: React.FC<DetallesModalProps> = ({ isOpen, onClose, propiedad }) => {
  if (!isOpen || !propiedad) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header del Modal */}
          <div className="relative p-8">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>

            {/* Título */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Detalles de la Propiedad
              </h2>
              <p className="text-white/70 text-sm">
                Información completa de la propiedad
              </p>
            </div>

            {/* Imagen de la propiedad */}
            <div className="mb-6">
              <img
                src={propiedad.imgURL}
                alt={propiedad.name || 'Propiedad'}
                className="w-full h-64 object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/144px-Chromium_T-Rex-error-offline.svg.png';
                }}
              />
            </div>

            {/* Información de la propiedad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-orange-primary/10 rounded-lg flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 text-orange-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {propiedad.name || 'Sin nombre'}
                  </h3>
                  <p className="text-white/60 text-sm">Nombre de la propiedad</p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {propiedad.addressProperty || 'Sin dirección'}
                  </h3>
                  <p className="text-white/60 text-sm">Dirección de la propiedad</p>
                </div>
              </div>

              {/* Precio */}
              <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CurrencyIcon className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {formatPrice(propiedad.priceProperty)}
                  </h3>
                  <p className="text-white/60 text-sm">Precio de la propiedad</p>
                </div>
              </div>

              {/* ID Propietario */}
              <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {propiedad.idOwner}
                  </h3>
                  <p className="text-white/60 text-sm">ID del propietario</p>
                </div>
              </div>

              {/* ID de la propiedad */}
              {propiedad._id && (
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl md:col-span-2">
                  <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {propiedad._id}
                    </h3>
                    <p className="text-white/60 text-sm">ID de la propiedad</p>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de cerrar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesModal;
