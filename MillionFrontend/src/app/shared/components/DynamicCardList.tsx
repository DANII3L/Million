import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Card } from './Card';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';

interface FilterConfig {
  type: 'search' | 'select';
  key: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface DynamicCardListProps {
  apiEndpoint: string;
  typeEndpoint: string;
  filters?: FilterConfig[];
  cardActions?: (item: any) => React.ReactNode;
  className?: string;
  mockData?: any[];
  getCardClassName?: (item: any) => string;
  renderCard?: (item: any) => React.ReactNode;
  title?: string;
  subtitle?: string;
  newButtonText?: string;
  newButtonLink?: string;
  onNew?: () => void;
  additionalParams?: { [key: string]: any };
}

const DynamicCardList: React.FC<DynamicCardListProps> = ({
  apiEndpoint,
  typeEndpoint,
  filters = [],
  cardActions,
  className = '',
  mockData,
  getCardClassName,
  renderCard,
  title,
  subtitle,
  newButtonText,
  newButtonLink,
  onNew,
  additionalParams = {},
}) => {
  const [data, setData] = useState<any[]>(mockData || []);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('Name'); // Columna por defecto
  const { addNotification } = useNotification();

  // Debounce para el search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (mockData) {
      setData(mockData);
      setIsInitialized(true);
      return;
    }
    fetchData();
    setIsInitialized(true);
    // eslint-disable-next-line
  }, [apiEndpoint, mockData]); // Solo se ejecuta cuando cambia el endpoint o mockData

  // useEffect separado para filtros con debounce
  useEffect(() => {
    if (mockData || !isInitialized || hasData) return; // No hacer peticiones si es mockData, no está inicializado, o ya tiene datos

    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, filterValues, additionalParams]); // Dependencias para filtros

  const fetchData = async () => {
    if (loading) return; // Evitar peticiones duplicadas

    setLoading(true);
    try {
      const params: any = {};

      // Agregar parámetros adicionales
      Object.assign(params, additionalParams);

      // Crear el cuerpo JSON como solicitas
      let requestBody = {};
      if (debouncedSearch) {
        // Encontrar la columna seleccionada para obtener su tipo
        const selectedColumnOption = additionalParams.columnOptions?.find((option: any) => option.value === selectedColumn);
        const columnType = selectedColumnOption?.type || 'string';
        
        // Crear el filtro según el tipo de dato
        let filterValue;
        if (columnType === 'number') {
          // Para campos numéricos, convertir a número si es posible
          const numericValue = parseFloat(debouncedSearch);
          if (!isNaN(numericValue)) {
            filterValue = numericValue;
          } else {
            // Si no es un número válido, usar regex para búsqueda parcial
            filterValue = { $regex: debouncedSearch, $options: 'i' };
          }
        } else {
          // Para campos string, usar regex para búsqueda parcial
          filterValue = { $regex: debouncedSearch, $options: 'i' };
        }
        
        requestBody = {
          Filter: JSON.stringify({
            [selectedColumn]: filterValue
          })
        };
      }

      const res = typeEndpoint === "get" ? await apiService.get(apiEndpoint, requestBody) : await apiService.post(apiEndpoint, requestBody);
      const list = res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setData(list);
        setHasData(true); // Marcar que ya se encontraron datos
        if (list.length === 0) {
          addNotification('No se encontraron registros', 'info');
        }
      } else if (res && res.message && !(res.status >= 200 && res.status < 300)) {
        addNotification(res.message, 'error');
        setData([]);
        setHasData(false);
      } else {
        setData([]);
        setHasData(false);
        addNotification('No se encontraron registros', 'info');
      }
    } catch (e: any) {
      setData([]);
      setHasData(false);
      const errorMessage = e?.response?.data?.message || e?.message || 'Error al cargar los datos';
      addNotification(errorMessage, 'error');
    }
    setLoading(false);
  };

  // Función para resetear y recargar datos
  const resetAndReload = () => {
    setHasData(false);
    setData([]);
    fetchData();
  };

  // Filtros locales (search y select)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setHasData(false); // Resetear cuando cambia la búsqueda
  };

  // Filtrado local para mockData
  let filteredData = data;
  if (mockData) {
    filteredData = mockData.filter(item => {
      let matches = true;
      filters.forEach(f => {
        if (f.type === 'search' && search) {
          const val = (item[f.key] || '').toString().toLowerCase();
          if (!val.includes(search.toLowerCase())) matches = false;
        }
        if (f.type === 'select' && filterValues[f.key]) {
          if ((item[f.key] || '') !== filterValues[f.key]) matches = false;
        }
      });
      return matches;
    });
  }

  const currentItems = mockData ? filteredData : data;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header reutilizable */}
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
            {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-2">
            {/* Botón de recarga */}
            {!mockData && (
              <button
                onClick={resetAndReload}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                title="Recargar datos"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Recargar</span>
              </button>
            )}
            {newButtonText && (newButtonLink ? (
              <Link
                to={newButtonLink}
                className="bg-gradient-to-r from-blue-primary to-red-primary hover:from-blue-500 hover:to-grey-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5" />
                <span>{newButtonText}</span>
              </Link>
            ) : (
              <button
                onClick={onNew}
                className="bg-gradient-to-r from-blue-primary to-red-primary hover:from-blue-500 hover:to-grey-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5" />
                <span>{newButtonText}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      {filters.length > 0 && (
        <div className="bg-black/10 backdrop-blur-lg p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Selector de columnas */}
            {additionalParams.columnOptions && (
              <div className="flex items-center space-x-2">
                <label className="text-text-primary text-sm font-medium">Buscar en:</label>
                <select
                  value={selectedColumn}
                  onChange={(e) => {
                    setSelectedColumn(e.target.value);
                    setHasData(false); // Resetear cuando cambia la columna
                  }}
                  className="bg-white/10 border border-white/20 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-primary focus:border-orange-primary transition-all duration-200 hover:bg-white/15 cursor-pointer"
                >
                  {additionalParams.columnOptions.map((option: any) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filters.map((filter) => {
              if (filter.type === 'search') {
                return (
                  <div key={filter.key} className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={filter.placeholder || 'Buscar...'}
                      value={search}
                      onChange={handleSearch}
                      className="w-full pl-4 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-primary focus:border-orange-primary transition-all duration-200 hover:bg-white/15"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary mx-auto"></div>
            <p className="mt-2 text-text-secondary">Cargando...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-secondary text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-text-primary">No se encontraron registros</h3>
            <p className="text-text-secondary mt-1">
              {search || Object.values(filterValues).some(v => v) ? 'Intenta con otros filtros' : 'Comienza agregando un nuevo registro'}
            </p>
          </div>
        ) : (
          currentItems.map((item, idx) => (
            renderCard ? (
              <React.Fragment key={item.id || idx}>{renderCard(item)}</React.Fragment>
            ) : (
              <Card key={item.id || idx} className={`p-6 ${getCardClassName ? getCardClassName(item) : ''}`}>
                {/* The cardFields prop was removed, so this loop will not render anything */}
                {cardActions && (
                  <div className="pt-4 border-t mt-2">{cardActions(item)}</div>
                )}
              </Card>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default DynamicCardList; 