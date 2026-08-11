import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const LimitReachedCard = () => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-lg mx-auto my-4">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Usage Limit Reached</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
        You've exhausted your AI requests for the current billing cycle. Upgrade to PRO to unlock higher limits and continue getting personalized career guidance.
      </p>
      <Button asChild className="w-full sm:w-auto">
        <Link to="/subscription">Upgrade to PRO</Link>
      </Button>
    </div>
  );
};
