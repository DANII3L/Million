import React, { createContext, useContext, useState } from 'react';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmationContextType = {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = () => {
  const ctx = useContext(ConfirmationContext);
  if (!ctx) throw new Error('useConfirmation debe usarse dentro de ConfirmationProvider');
  return ctx;
};

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((result: boolean) => void) | null>(null);

  const showConfirm = (options: ConfirmOptions) => {
    setModal(options);
    return new Promise<boolean>(resolve => {
      setResolver(() => resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setModal(null);
    resolver?.(result);
  };

  return (
    <ConfirmationContext.Provider value={{ showConfirm }}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">{modal.title || '¿Confirmar acción?'}</h2>
            <p className="mb-4 text-text-secondary">{modal.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => handleClose(false)}
              >
                {modal.cancelText || 'Cancelar'}
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleClose(true)}
              >
                {modal.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
}; 