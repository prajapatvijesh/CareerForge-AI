import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Shield, CreditCard, Activity, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export const AdminUserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-user-details', id],
    queryFn: () => adminApi.getUserDetails(id!),
    enabled: !!id
  });

  const statusMutation = useMutation({
    mutationFn: (status: 'ACTIVE' | 'SUSPENDED') => adminApi.updateUserStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-details', id] });
      alert('User status updated');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Failed to update status')
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">Failed to load user details.</div>;

  const { profile, subscription, usage, billing } = data;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: Shield },
    { id: 'usage', label: 'AI Usage', icon: Activity },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/users" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {profile.name}
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {profile.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              profile.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.role}
            </span>
          </h1>
          <p className="text-gray-500">{profile.email} • Joined {format(new Date(profile.createdAt), 'MMM dd, yyyy')}</p>
        </div>
        
        <div className="ml-auto">
          {profile.status === 'ACTIVE' ? (
            <Button 
              variant="destructive" 
              onClick={() => {
                if(window.confirm('Suspend user? They will lose access immediately.')) statusMutation.mutate('SUSPENDED');
              }}
              disabled={statusMutation.isPending}
            >
              Suspend User
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => {
                if(window.confirm('Restore user access?')) statusMutation.mutate('ACTIVE');
              }}
              disabled={statusMutation.isPending}
            >
              Restore Access
            </Button>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium font-mono text-sm mt-1 dark:text-white">{profile.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium mt-1 dark:text-white">{profile.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="font-medium mt-1 dark:text-white">{profile.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium mt-1 dark:text-white">{format(new Date(profile.createdAt), 'PPpp')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Plan</h3>
            <div className={`p-6 rounded-xl border ${subscription.plan === 'PRO' ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50' : 'bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Plan Level</p>
                  <p className="text-2xl font-bold dark:text-white">{subscription.plan}</p>
                  <p className="text-sm mt-2 font-medium capitalize dark:text-white">Status: {subscription.status.toLowerCase()}</p>
                </div>
                {subscription.plan === 'PRO' && subscription.periodEnd && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Period Ends</p>
                    <p className="font-medium dark:text-white">{format(new Date(subscription.periodEnd), 'MMM dd, yyyy')}</p>
                    {subscription.canceled && (
                      <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Cancels at period end</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Month Limits</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-sm text-gray-500">Resumes Created</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.currentMonth?.resumesCreated || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-sm text-gray-500">Jobs Tracked</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.currentMonth?.jobApplications || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-sm text-gray-500">Resume Analyses</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.currentMonth?.resumeAnalysis || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-sm text-gray-500">Mock Interviews</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.currentMonth?.mockInterviews || 0}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All-Time AI Consumption</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <p className="text-sm text-gray-500">Total API Requests</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.allTimeAI?.totalRequests || 0}</p>
                </div>
                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <p className="text-sm text-gray-500">Total Tokens</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.allTimeAI?.totalTokens || 0}</p>
                </div>
                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <p className="text-sm text-gray-500">Prompt Tokens</p>
                  <p className="text-xl font-bold mt-1 dark:text-white">{usage.allTimeAI?.promptTokens || 0}</p>
                </div>
                <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <p className="text-sm text-gray-500">Estimated Cost</p>
                  <p className="text-xl font-bold mt-1 text-red-500">${(usage.allTimeAI?.estimatedCostUsd || 0).toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing History</h3>
            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>
                <p className="text-xl font-bold dark:text-white">{billing.totalPayments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Successful</p>
                <p className="text-xl font-bold text-green-500">{billing.successfulPayments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-xl font-bold text-red-500">{billing.failedPayments}</p>
              </div>
            </div>

            {billing.payments.length === 0 ? (
              <p className="text-gray-500 italic">No payments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500">
                    <tr>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Amount</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {billing.payments.map((payment: any) => (
                      <tr key={payment._id}>
                        <td className="py-3 px-4 dark:text-gray-300">{format(new Date(payment.createdAt), 'MMM dd, yyyy')}</td>
                        <td className="py-3 px-4 dark:text-gray-300">{(payment.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: payment.currency })}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            payment.status === 'CAPTURED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">{payment.providerPaymentId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
