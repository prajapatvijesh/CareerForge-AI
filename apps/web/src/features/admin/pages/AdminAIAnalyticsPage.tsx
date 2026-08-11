import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { StatCard } from '../components/StatCard';
import { Activity, Cpu, FileText, Users, DollarSign } from 'lucide-react';

export const AdminAIAnalyticsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-ai-analytics'],
    queryFn: adminApi.getAIAnalytics
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading AI analytics...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">Failed to load AI analytics.</div>;

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Consumption</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor Gemini API usage and costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total API Requests" 
          value={data.totalRequests.toLocaleString()} 
          icon={Activity} 
        />
        <StatCard 
          title="Total Tokens Processed" 
          value={data.totalTokens.toLocaleString()} 
          icon={Cpu} 
        />
        <StatCard 
          title="Estimated Cost (USD)" 
          value={`$${data.estimatedCost.toFixed(4)}`} 
          icon={DollarSign} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="w-5 h-5 text-blue-500" /> Feature Breakdown
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400">Resume Analysis</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{data.resumeAnalyses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-600 dark:text-gray-400">Mock Interviews</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{data.mockInterviews.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
