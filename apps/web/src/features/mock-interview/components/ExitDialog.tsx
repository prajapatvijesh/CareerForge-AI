import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ExitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ExitDialog: React.FC<ExitDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Exit Interview?</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Your progress has been auto-saved. You can resume this interview later from your history dashboard.
        </p>
        <div className="flex items-center gap-3 w-full">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1 rounded-xl" onClick={onConfirm}>
            Yes, Exit
          </Button>
        </div>
      </div>
    </div>
  );
};
