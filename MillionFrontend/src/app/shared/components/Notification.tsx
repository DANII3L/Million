import React, { useEffect, useState } from 'react';
import { Notification as NotificationProps } from '../contexts/NotificationContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface Props {
  notification: NotificationProps;
  onClose: () => void;
}

const ICONS = {
  success: <CheckCircle className="h-6 w-6" />,
  error: <XCircle className="h-6 w-6" />,
  info: <Info className="h-6 w-6" />,
  warning: <AlertTriangle className="h-6 w-6" />,
};

const COLORS = {
  success: 'bg-green-500/95 border-green-600',
  error: 'bg-red-500/95 border-red-600',
  info: 'bg-blue-500/95 border-blue-600',
  warning: 'bg-yellow-500/95 border-yellow-600',
};

const NOTIFICATION_TIMEOUT = 5000; // 5 seconds

const Notification: React.FC<Props> = ({ notification, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, NOTIFICATION_TIMEOUT);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 300);
  };

  // Esta clase se cambiará por una animación de Tailwind
  const animationClass = exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0';

  return (
    <div
      className={`relative flex items-center p-4 text-white rounded-xl shadow-lg border-l-4 overflow-hidden transform transition-all duration-300 ${COLORS[notification.type]} ${animationClass}`}
      role="alert"
    >
      <div className="mr-4 shrink-0">{ICONS[notification.type]}</div>
      <p className="flex-1 font-medium">{notification.message}</p>
      <button
        onClick={handleClose}
        className="ml-4 -mr-2 p-1.5 rounded-full hover:bg-white/20 transition-colors shrink-0"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/30"
        style={{ animation: `shrink ${NOTIFICATION_TIMEOUT}ms linear forwards` }}
      />
    </div>
  );
};

export default Notification; 