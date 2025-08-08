import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NotificationProvider } from './app/shared/contexts/NotificationContext.tsx';
import { ConfirmationProvider } from './app/shared/contexts/ConfirmationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <NotificationProvider>
        <ConfirmationProvider>
          <App />
        </ConfirmationProvider>
      </NotificationProvider>
  </StrictMode>
);
