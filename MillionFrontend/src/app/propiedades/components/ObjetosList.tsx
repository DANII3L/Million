import React, { useState } from 'react';
import { HomeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import DynamicCardList from '../../shared/components/DynamicCardList';
import { Propiedad } from '../models/Propiedad';
import DetallesModal from './DetallesModal';
import './ObjetosList.css';

const ObjetosList: React.FC = () => {
  const [selectedPropiedad, setSelectedPropiedad] = useState<Propiedad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters] = useState([
    {
      type: 'search' as const,
      key: 'search',
      placeholder: 'Buscar propiedades...'
    }
  ]);

  // Opciones de columnas disponibles
  const columnOptions = [
    { value: 'Name', label: 'Nombre', type: 'string' },
    { value: 'AddressProperty', label: 'Dirección', type: 'string' },
    { value: 'PriceProperty', label: 'Precio', type: 'number' }
  ];

  const getPriceColor = (price: number) => {
    if (price >= 50000) return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (price >= 30000) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleOpenModal = (propiedad: Propiedad) => {
    setSelectedPropiedad(propiedad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPropiedad(null);
  };

  const renderPropiedadCard = (propiedad: Propiedad) => (
    <div className="objetos-list-card p-6 rounded-2xl border hover:shadow-xl group flex flex-col h-full relative">

      {/* Imagen de la propiedad */}
      <div className="mb-4">
        <img 
          src={propiedad.imgURL} 
          alt={propiedad.name}
          className="w-full h-48 object-cover rounded-xl"
          onError={(e) => {
            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chromium_T-Rex-error-offline.svg/144px-Chromium_T-Rex-error-offline.svg.png';
          }}
        />
      </div>

      {/* Información principal */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-primary/10 rounded-xl flex items-center justify-center">
            <HomeIcon className="h-6 w-6 text-orange-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-primary transition-colors duration-200">
              {propiedad.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriceColor(propiedad.priceProperty)}`}>
              {formatPrice(propiedad.priceProperty)}
            </span>
          </div>
        </div>
      </div>

      {/* Detalles de la propiedad */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-white/80">
          <MapPinIcon className="h-4 w-4" />
          <span className="text-sm">{propiedad.addressProperty}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="pt-4 border-t border-white/20">
        <button
          onClick={() => handleOpenModal(propiedad)}
          className="w-full bg-white/10 hover:bg-orange-primary/10 text-white hover:text-orange-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center block"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );

  return (
    <>
      <section className="objetos-list-container">
        <div className="objetos-list-background"></div>
        <div className="objetos-list-content">
          <div className="objetos-list-dynamic-container">
            <DynamicCardList
              apiEndpoint="/Object/get"
              typeEndpoint="get"
              filters={filters}
              renderCard={renderPropiedadCard}
              title="Propiedades Inmobiliarias"
              subtitle="Gestiona el catálogo de propiedades disponibles"
              className="w-full h-full max-w-none text-white [&_*]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_p]:text-white [&_span]:text-white [&_input]:text-white [&_input]:placeholder-white/60 [&_input]:border-white/30 [&_input]:bg-white/10 [&_select]:text-white [&_select]:border-white/30 [&_select]:bg-white/10 [&_button]:text-white"
              additionalParams={{
                columnOptions: columnOptions
              }}
            />
          </div>
        </div>
      </section>

      {/* Modal de Detalles */}
      <DetallesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        propiedad={selectedPropiedad}
      />
    </>
  );
};

export default ObjetosList;