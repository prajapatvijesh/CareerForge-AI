import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { StatCard } from '../components/StatCard';
import { CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export const AdminBillingPage = () => {
  const [page, setPage] = useState(1);
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: adminApi.getRevenueAnalytics
  });

  const { data: paymentData, isLoading: paymentLoading } = useQuery({
    queryKey: ['admin-payments', page],
    queryFn: () => adminApi.getPayments({ page })
  });

  if (revenueLoading || paymentLoading) return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (!revenueData || !paymentData) return <div className="p-8 text-center text-red-500">Failed to load billing analytics.</div>;

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Revenue</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor financial health and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(revenueData.total)} 
          icon={CreditCard} 
        />
        <StatCard 
          title="Revenue This Month" 
          value={formatCurrency(revenueData.thisMonth)} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Failed Transactions" 
          value={revenueData.failedPayments} 
          icon={AlertTriangle} 
          trend={{ value: 'Needs attention', isPositive: false }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Monthly Revenue History</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData.history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `₹${value / 100}`} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
              />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">User ID</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.payments.map((payment: any) => (
                <tr key={payment._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">{format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                  <td className="py-3 px-4 font-mono text-xs">{payment.userId}</td>
                  <td className="py-3 px-4">{(payment.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: payment.currency })}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      payment.status === 'CAPTURED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{payment.providerPaymentId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paymentData.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-sm text-gray-500">Page {page} of {paymentData.totalPages}</span>
            <Button variant="outline" disabled={page === paymentData.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};
