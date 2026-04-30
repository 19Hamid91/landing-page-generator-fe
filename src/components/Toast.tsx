'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 400); // match animation duration
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 400);
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-white" />,
    error: <AlertCircle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />,
    warning: <AlertTriangle className="w-5 h-5 text-white" />,
  };

  const styles = {
    success: 'bg-emerald-600 border-emerald-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500',
    warning: 'bg-amber-600 border-amber-500',
  };

  return (
    <div className={clsx(
      'fixed bottom-6 right-6 z-[999] flex items-center gap-3 p-4 rounded-xl border shadow-2xl transition-all duration-400 min-w-[320px] max-w-md',
      styles[type],
      isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
    )}>
      <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">{icons[type]}</div>
      <div className="flex-1 text-sm font-bold text-white leading-tight">{message}</div>
      <button 
        onClick={handleClose}
        className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors text-white/60 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
