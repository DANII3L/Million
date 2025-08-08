import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../shared/components/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';
import '../../shared/styles/ModalDynamicForm.css';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/contexts/NotificationContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const fields: IFieldConfig[] = [
    {
      name: 'username',
      label: 'Usuario',
      type: 'text',
      required: true,
      placeholder: 'usuario',
      colSpan: 2
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      placeholder: '••••••••',
      colSpan: 2
    }
  ];

  const initialValues = {
    username: '',
    password: ''
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setIsLoading(true);

    try {
      const success = await login(values.username, values.password);
      if (success) {
        console.log('success', success);  
        addNotification('¡Bienvenido de nuevo!', 'success');
        onClose();
        navigate('/');
      }
    } catch (err: any) {
      addNotification(err.message || 'Credenciales o ID de empresa inválidos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-black/10 backdrop-blur-xl rounded-3xl border border-black/20 shadow-2xl overflow-hidden">
          {/* Header del Modal */}
          <div className="relative p-8 text-center">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-black/60 hover:text-black transition-colors duration-200"
            >
              <X size={24} />
            </button>

            {/* Icono */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#1a2e29] to-[#34615a] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#34615a] rounded-sm"></div>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Inicia Sesión
            </h2>
            <p className="text-white/70 text-sm">
              Accede a tu cuenta de Million
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8">
            <DynamicForm
              fields={fields}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitText={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              className="space-y-6 modal-dynamic-form"
              renderSubmitButton={({ submitText }) => (
                <div className="space-y-6">
                  {/* Botón de Login */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#1a2e29] to-[#34615a] hover:from-[#34615a] hover:to-[#1a2e29] text-white py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {submitText}
                      </div>
                    ) : (
                      submitText
                    )}
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 