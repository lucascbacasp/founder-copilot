'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={clsx(
        'rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg animate-in slide-in-from-right-5 fade-in duration-200',
        toast.type === 'success' && 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
        toast.type === 'error' && 'bg-red-500/15 border-red-500/30 text-red-400',
        toast.type === 'info' && 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
      )}
    >
      {toast.message}
    </div>
  );
}
