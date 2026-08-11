import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface UsageProgressProps {
  label: string;
  used: number;
  limit: number;
}

export const UsageProgress: React.FC<UsageProgressProps> = ({ label, used, limit }) => {
  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80 && percentage < 100;
  const isAtLimit = percentage >= 100;

  let colorClass = 'bg-primary-500';
  if (isNearLimit) colorClass = 'bg-yellow-500';
  if (isAtLimit) colorClass = 'bg-red-500';

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {label}
          {isAtLimit && <AlertCircle className="w-4 h-4 text-red-500" />}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {used} / {limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={clsx('h-2.5 rounded-full', colorClass)}
        />
      </div>
      {isNearLimit && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          Approaching limit. Consider upgrading your plan.
        </p>
      )}
      {isAtLimit && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Limit reached. Upgrade to continue using this feature.
        </p>
      )}
    </div>
  );
};
