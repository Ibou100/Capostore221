import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-zinc-300 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm">
      <div className="bg-capo-black text-white px-4 py-3 rounded-none shadow-2xl border border-zinc-800 flex items-center gap-3">
        {icons[toast.type]}
        <span className="text-xs font-medium tracking-wide leading-snug">
          {toast.message}
        </span>
      </div>
    </div>
  );
};
