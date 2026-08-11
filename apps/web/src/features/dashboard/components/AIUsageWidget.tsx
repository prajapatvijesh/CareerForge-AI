import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '../../subscription/api/subscription.api';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const AIUsageWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionApi.getCurrent,
  });

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse h-48">
      </div>
    );
  }

  const { subscription, usage, limits } = data;
  const percentage = Math.min((usage.aiRequests / limits.aiRequestsPerMonth) * 100, 100);

  let colorClass = 'bg-primary';
  if (percentage >= 80) colorClass = 'bg-yellow-500';
  if (percentage >= 100) colorClass = 'bg-red-500';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          AI Usage
        </h3>
        
        <div className="mb-2 flex justify-between items-center text-sm font-medium">
          <span className="text-muted-foreground">General AI Requests</span>
          <span>{usage.aiRequests} / {limits.aiRequestsPerMonth}</span>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            className={clsx('h-full rounded-full', colorClass)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
          {subscription.plan} PLAN
        </div>
        
        {subscription.plan === 'FREE' && (
          <Link to="/subscription" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
};
