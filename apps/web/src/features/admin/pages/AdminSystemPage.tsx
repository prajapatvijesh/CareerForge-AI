import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { Database, Server, Cpu, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const AdminSystemPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: adminApi.getSystemHealth,
    refetchInterval: 30000 // refresh every 30s
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Checking system health...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">Failed to load system health.</div>;

  const getStatusColor = (status: string) => {
    if (status === 'healthy' || status === 'configured') return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (status === 'unhealthy' || status === 'unconfigured') return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'healthy' || status === 'configured') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const systems = [
    { name: 'Core API', status: data.api, icon: Server, description: 'Main backend services and routing' },
    { name: 'Database', status: data.database, icon: Database, description: 'MongoDB connection state' },
    { name: 'Gemini AI', status: data.gemini, icon: Cpu, description: 'Generative AI provider configuration' },
    { name: 'Razorpay', status: data.razorpay, icon: CreditCard, description: 'Payment gateway configuration' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Health</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor critical infrastructure and integrations.</p>
        <p className="text-xs text-gray-400 mt-1">Last updated: {format(new Date(data.timestamp), 'HH:mm:ss')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systems.map((sys) => (
          <div key={sys.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${getStatusColor(sys.status)}`}>
              <sys.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sys.name}</h3>
                <StatusIcon status={sys.status} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sys.description}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {sys.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
