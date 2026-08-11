import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { UsageProgress } from '../components/UsageProgress';
import { Zap, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { loadRazorpay } from '../../../lib/razorpay';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export const SubscriptionPage = () => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionApi.getCurrent,
  });

  const { data: history } = useQuery({
    queryKey: ['payment-history'],
    queryFn: subscriptionApi.getPaymentHistory,
  });

  const checkoutMutation = useMutation({
    mutationFn: subscriptionApi.checkout,
    onSuccess: async (data) => {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || data.keyId,
        subscription_id: data.subscriptionId,
        name: 'CareerForge AI',
        description: 'PRO Plan Subscription',
        handler: async function (response: any) {
          try {
            await subscriptionApi.verifyCheckout({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            });
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['payment-history'] });
            alert('Payment verified! Your PRO plan is now active.');
          } catch (err) {
            console.error('Verification failed', err);
            alert('Payment verification failed. If amount was deducted, it will be refunded or synced shortly.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        theme: {
          color: '#4F46E5', // primary-600
        },
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Checkout failed');
      setIsProcessing(false);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionApi.cancelSubscription,
    onSuccess: () => {
      alert('Subscription cancelled. You will have access until the end of the billing period.');
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  });

  const handleUpgrade = () => {
    setIsProcessing(true);
    checkoutMutation.mutate();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your PRO subscription? You will still have access until the end of your current billing cycle.')) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading subscription details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Failed to load subscription.</div>;
  if (!data) return null;

  const { subscription, limits, usage } = data;
  const isPro = subscription.plan === 'PRO';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription & Usage</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your plan and monitor your monthly AI usage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Usage Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            Current Usage
          </h2>
          <UsageProgress 
            label="Resume Analysis" 
            used={usage.resumeAnalysis} 
            limit={limits.resumeAnalysisPerMonth} 
          />
          <UsageProgress 
            label="Mock Interviews" 
            used={usage.mockInterviews} 
            limit={limits.mockInterviewsPerMonth} 
          />
          <UsageProgress 
            label="General AI Requests" 
            used={usage.aiRequests} 
            limit={limits.aiRequestsPerMonth} 
          />
          <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            Usage resets on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
          </p>
        </div>

        {/* Plan Card */}
        <div className={`rounded-2xl p-6 shadow-sm border ${isPro ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-transparent' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isPro ? 'text-indigo-400' : 'text-indigo-500'}`} />
            Current Plan: {subscription.plan}
          </h2>
          <p className={isPro ? 'text-indigo-200 mb-6' : 'text-gray-500 dark:text-gray-400 mb-6'}>
            Status: <span className="font-medium capitalize">{subscription.status.toLowerCase()}</span>
            {subscription.cancelAtPeriodEnd && (
              <span className="block mt-1 text-orange-300 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Cancels at end of period
              </span>
            )}
          </p>

          {!isPro && (
            <div className="space-y-4">
              <div className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Resume Analyses</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Mock Interviews</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Priority Support</div>
              </div>
              <Button 
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                {isProcessing ? 'Loading Checkout...' : 'Upgrade to PRO'}
              </Button>
            </div>
          )}
          {isPro && (
            <div className="space-y-6">
              <p className="text-indigo-100">You are on the highest tier plan. Enjoy unlimited potential!</p>
              
              {!subscription.cancelAtPeriodEnd && (
                <Button 
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  variant="outline"
                  className="w-full border-indigo-500 text-indigo-300 hover:bg-indigo-800/50 hover:text-white"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Billing History
        </h2>
        
        {!history ? (
          <div className="animate-pulse space-y-4">
             <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
             <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ) : history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No payment history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {history.map((payment: any) => (
                  <tr key={payment._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">{payment.paidAt ? format(new Date(payment.paidAt), 'MMM dd, yyyy') : format(new Date(payment.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="py-3 px-4">{(payment.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: payment.currency })}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        payment.status === 'CAPTURED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{payment.providerPaymentId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
