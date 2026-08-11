import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/features/core/layout/MainLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ProtectedAdminRoute } from '@/features/admin/components/ProtectedAdminRoute';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

// Core
const LandingPage = lazy(() => import('@/features/core/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const NotFoundPage = lazy(() => import('@/features/core/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Auth
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/features/auth/pages/SignupPage').then(m => ({ default: m.SignupPage })));

// Features
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ResumeListPage = lazy(() => import('@/features/resume-builder/pages/ResumeListPage').then(m => ({ default: m.ResumeListPage })));
const ResumeEditorPage = lazy(() => import('@/features/resume-builder/pages/ResumeEditorPage').then(m => ({ default: m.ResumeEditorPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const JobTrackerPage = lazy(() => import('@/features/job-tracker/pages/JobTrackerPage').then(m => ({ default: m.JobTrackerPage })));
const ResumeAnalysisPage = lazy(() => import('@/features/resume-analysis/pages/ResumeAnalysisPage').then(m => ({ default: m.ResumeAnalysisPage })));
const InterviewHome = lazy(() => import('@/features/mock-interview/pages/InterviewHome').then(m => ({ default: m.InterviewHome })));
const InterviewSession = lazy(() => import('@/features/mock-interview/pages/InterviewSession').then(m => ({ default: m.InterviewSession })));
const InterviewResult = lazy(() => import('@/features/mock-interview/pages/InterviewResult').then(m => ({ default: m.InterviewResult })));
const SubscriptionPage = lazy(() => import('@/features/subscription/pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const CareerAssistantPage = lazy(() => import('@/features/career-assistant/pages/CareerAssistantPage').then(m => ({ default: m.CareerAssistantPage })));

// Admin
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminUserDetailsPage = lazy(() => import('@/features/admin/pages/AdminUserDetailsPage').then(m => ({ default: m.AdminUserDetailsPage })));
const AdminBillingPage = lazy(() => import('@/features/admin/pages/AdminBillingPage').then(m => ({ default: m.AdminBillingPage })));
const AdminAIAnalyticsPage = lazy(() => import('@/features/admin/pages/AdminAIAnalyticsPage').then(m => ({ default: m.AdminAIAnalyticsPage })));
const AdminAuditLogsPage = lazy(() => import('@/features/admin/pages/AdminAuditLogsPage').then(m => ({ default: m.AdminAuditLogsPage })));
const AdminSystemPage = lazy(() => import('@/features/admin/pages/AdminSystemPage').then(m => ({ default: m.AdminSystemPage })));

// Fallback loader component
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: withSuspense(NotFoundPage),
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'signup',
        element: withSuspense(SignupPage),
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: withSuspense(DashboardPage) },
          { path: 'profile', element: withSuspense(ProfilePage) },
          { path: 'resumes', element: withSuspense(ResumeListPage) },
          { path: 'resumes/:id', element: withSuspense(ResumeEditorPage) },
          { path: 'resumes/:resumeId/analysis', element: withSuspense(ResumeAnalysisPage) },
          { path: 'jobs', element: withSuspense(JobTrackerPage) },
          { path: 'interviews', element: withSuspense(InterviewHome) },
          { path: 'interviews/:id', element: withSuspense(InterviewSession) },
          { path: 'interviews/:id/result', element: withSuspense(InterviewResult) },
          { path: 'subscription', element: withSuspense(SubscriptionPage) },
          { path: 'assistant', element: withSuspense(CareerAssistantPage) },
          { path: 'assistant/:id', element: withSuspense(CareerAssistantPage) },
        ],
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    errorElement: withSuspense(NotFoundPage),
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: withSuspense(AdminDashboardPage) },
          { path: 'users', element: withSuspense(AdminUsersPage) },
          { path: 'users/:id', element: withSuspense(AdminUserDetailsPage) },
          { path: 'billing', element: withSuspense(AdminBillingPage) },
          { path: 'ai', element: withSuspense(AdminAIAnalyticsPage) },
          { path: 'audit-logs', element: withSuspense(AdminAuditLogsPage) },
          { path: 'system', element: withSuspense(AdminSystemPage) },
        ],
      },
    ],
  },
]);
