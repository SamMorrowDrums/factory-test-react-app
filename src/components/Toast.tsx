import { memo, useEffect, useRef, useCallback } from 'react';
import './Toast.css';

export interface ToastData {
  id: string;
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
  /** Auto-dismiss delay in ms (default 3000). */
  duration?: number;
}

export const Toast = memo(function Toast({ toast, onDismiss, duration = 3000 }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast.id, onDismiss, duration]);

  const handleDismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);

  return (
    <div className="toast" role="status" aria-live="polite" aria-atomic="true">
      <span className="toast__message">{toast.message}</span>
      <button
        className="toast__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
});

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
