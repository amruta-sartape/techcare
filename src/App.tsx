import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './components/ui/Toast';
import { parseAuthCallbackFromUrl, processAuthCallback, supabase } from './lib/supabase';
import { ADMIN_OWNER_EMAIL } from './types';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { TechnicianLayout } from './components/layout/TechnicianLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { FAQPage } from './pages/public/FAQPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyDevicesPage } from './pages/customer/MyDevicesPage';
import { CustomerRequestsPage } from './pages/customer/CustomerRequestsPage';
import { AppointmentsPage } from './pages/customer/AppointmentsPage';
import { CustomerInvoicesPage } from './pages/customer/CustomerInvoicesPage';
import { WarrantyPage } from './pages/customer/WarrantyPage';
import { CustomerMessagesPage } from './pages/customer/CustomerMessagesPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { NotificationsPage } from './pages/customer/NotificationsPage';

// Technician Pages
import { TechnicianDashboard } from './pages/tech/TechnicianDashboard';
import { TechnicianJobsPage } from './pages/tech/TechnicianJobsPage';
import { TechnicianSchedulePage } from './pages/tech/TechnicianSchedulePage';
import { TechnicianCustomersPage } from './pages/tech/TechnicianCustomersPage';
import { TechnicianMessagesPage } from './pages/tech/TechnicianMessagesPage';
import { TechnicianPerformancePage } from './pages/tech/TechnicianPerformancePage';
import { TechnicianProfilePage } from './pages/tech/TechnicianProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminInvoicesPage } from './pages/admin/AdminInvoicesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminTechniciansPage } from './pages/admin/AdminTechniciansPage';
import { AdminDevicesPage } from './pages/admin/AdminDevicesPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminAIAssistantPage } from './pages/admin/AdminAIAssistantPage';

// Service Flows
import { NewServiceRequestFlow } from './components/service/NewServiceRequestFlow';
import { ServiceRequestDetail } from './components/service/ServiceRequestDetail';
import { AccessRestricted } from './components/ui/AccessRestricted';

const AppContent: React.FC = () => {
  const { user, isLoading, switchRolePersona, logout } = useAuth();
  const { success, error } = useToast();

  const [isPasswordRecoveryActive, setIsPasswordRecoveryActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (sessionStorage.getItem('techcare_password_recovery_active') === 'true') {
        return true;
      }
    } catch {}
    const href = window.location.href;
    const hash = window.location.hash;
    const search = window.location.search;
    if (
      href.includes('type=recovery') ||
      hash.includes('type=recovery') ||
      search.includes('type=recovery') ||
      hash.includes('reset-password')
    ) {
      try {
        sessionStorage.setItem('techcare_password_recovery_active', 'true');
      } catch {}
      return true;
    }
    const callbackInfo = parseAuthCallbackFromUrl();
    if (callbackInfo.isRecovery) {
      try {
        sessionStorage.setItem('techcare_password_recovery_active', 'true');
      } catch {}
      return true;
    }
    return false;
  });

  // Navigation State with Hash Support
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const href = typeof window !== 'undefined' ? window.location.href : '';
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';
    const isRecoveryUrl =
      href.includes('type=recovery') ||
      hash.includes('type=recovery') ||
      hash.includes('reset-password') ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('techcare_password_recovery_active') === 'true');

    if (isRecoveryUrl) {
      return 'reset-password';
    }

    const callbackInfo = parseAuthCallbackFromUrl();
    if (callbackInfo.isAuthCallback) {
      return callbackInfo.isRecovery ? 'reset-password' : 'auth-verifying';
    }
    if (hash) {
      return hash.split('?')[0];
    }
    return 'home';
  });

  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);

  const [currentParam, setCurrentParam] = useState<string | undefined>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.includes('?id=')) {
      return hash.split('?id=')[1];
    }
    return undefined;
  });

  const navigate = (page: string, param?: string) => {
    if (page !== 'reset-password') {
      try {
        sessionStorage.removeItem('techcare_password_recovery_active');
      } catch {}
      setIsPasswordRecoveryActive(false);
    }
    setCurrentPage(page);
    setCurrentParam(param);
    if (param) {
      window.location.hash = `/${page}?id=${param}`;
    } else {
      window.location.hash = `/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync hash changes (e.g. browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const href = window.location.href;

      // If password recovery is active or in URL, lock to reset-password
      const isRecovery =
        href.includes('type=recovery') ||
        hash.includes('type=recovery') ||
        hash.includes('reset-password') ||
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('techcare_password_recovery_active') === 'true');

      if (isRecovery) {
        setIsPasswordRecoveryActive(true);
        setCurrentPage('reset-password');
        return;
      }

      if (hash) {
        // Ignore Supabase auth callback fragments
        if (hash.includes('access_token=') || hash.includes('error=')) {
          return;
        }
        const [page, queryString] = hash.split('?');
        setCurrentPage(page);
        if (queryString && queryString.startsWith('id=')) {
          setCurrentParam(queryString.replace('id=', ''));
        } else {
          setCurrentParam(undefined);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen for Supabase password recovery events from anywhere
  useEffect(() => {
    const handlePasswordRecoveryEvent = () => {
      try {
        sessionStorage.setItem('techcare_password_recovery_active', 'true');
      } catch {}
      setIsPasswordRecoveryActive(true);
      setCurrentPage('reset-password');
      if (window.location.hash !== '#/reset-password' && window.location.hash !== '#reset-password') {
        window.location.hash = '/reset-password';
      }
    };

    window.addEventListener('techcare_password_recovery', handlePasswordRecoveryEvent);

    // Also register onAuthStateChange directly for real-time recovery events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        handlePasswordRecoveryEvent();
      }
    });

    return () => {
      window.removeEventListener('techcare_password_recovery', handlePasswordRecoveryEvent);
      subscription?.unsubscribe();
    };
  }, []);

  // Handle incoming email confirmation or password reset callbacks
  useEffect(() => {
    const callbackInfo = parseAuthCallbackFromUrl();
    if (!callbackInfo.isAuthCallback) return;

    let isMounted = true;

    async function handleAuthVerification() {
      const result = await processAuthCallback();
      if (!isMounted || !result) return;

      // Clean the address bar of sensitive tokens and fragments
      const targetHash = `#${result.targetPage}`;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `${window.location.pathname}${targetHash}`);
      }

      if (result.isRecovery) {
        setIsPasswordRecoveryActive(true);
        setCurrentPage('reset-password');
        if (result.success) {
          success('Recovery Session Active', 'Admin recovery session authenticated. Please set your new password.');
        } else if (result.error) {
          setResetPasswordError(result.error);
          error('Password Recovery Notice', result.error);
        }
        navigate('reset-password');
        return;
      } else {
        if (result.success) {
          success('Email Confirmed', result.message || 'Email verification completed successfully.');
        } else if (result.error) {
          error('Verification Issue', result.error);
        }
        navigate(result.targetPage);
      }
    }

    handleAuthVerification();

    return () => {
      isMounted = false;
    };
  }, []);

  // Determine current active section
  const isCustomerPage = [
    'customer-dashboard',
    'my-devices',
    'service-requests',
    'service-history',
    'appointments',
    'invoices',
    'warranty',
    'warranties',
    'messages',
    'customer-profile',
    'notifications'
  ].includes(currentPage);

  const isTechPage = [
    'tech-dashboard',
    'tech-jobs',
    'tech-schedule',
    'tech-customers',
    'tech-messages',
    'tech-performance',
    'tech-profile'
  ].includes(currentPage);

  const isAdminPage = [
    'admin-dashboard',
    'admin-requests',
    'admin-services',
    'admin-inventory',
    'admin-users',
    'admin-invoices',
    'admin-analytics',
    'admin-settings',
    'admin-technicians',
    'admin-customers',
    'admin-devices',
    'admin-appointments',
    'admin-reviews',
    'admin-ai'
  ].includes(currentPage);

  // Email Verification & Auth Confirmation Loading Screen
  if (currentPage === 'auth-verifying') {
    return (
      <div className="min-h-screen bg-[#080d19] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Verifying Email Security Token</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Confirming your email verification and establishing your secure TechCare session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Password Recovery Loading Screen
  if (currentPage === 'reset-password-verifying') {
    return (
      <div className="min-h-screen bg-[#080d19] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Verifying Password Recovery Token</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Validating your security recovery credentials and opening the password update form...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Core Flows (New Request & Request Detail)
  if (currentPage === 'new-request') {
    const content = (
      <NewServiceRequestFlow
        preselectedServiceId={currentParam}
        onComplete={(newId) => navigate('request-detail', newId)}
        onCancel={() => {
          if (user?.role === 'admin') navigate('admin-requests');
          else if (user?.role === 'technician') navigate('tech-jobs');
          else if (user?.role === 'customer') navigate('customer-dashboard');
          else navigate('home');
        }}
      />
    );

    if (user?.role === 'admin') {
      return (
        <AdminLayout currentPage="admin-requests" onNavigate={navigate}>
          {content}
        </AdminLayout>
      );
    }
    if (user?.role === 'technician') {
      return (
        <TechnicianLayout currentPage="tech-jobs" onNavigate={navigate}>
          {content}
        </TechnicianLayout>
      );
    }
    if (user?.role === 'customer') {
      return (
        <CustomerLayout currentPage="service-requests" onNavigate={navigate}>
          {content}
        </CustomerLayout>
      );
    }
    return (
      <PublicLayout currentPage="new-request" onNavigate={navigate}>
        <div className="py-8">{content}</div>
      </PublicLayout>
    );
  }

  if (currentPage === 'request-detail' && currentParam) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-cyan-400">Loading service ticket...</span>
          </div>
        </div>
      );
    }

    const handleBack = () => {
      if (window.history.length > 1) {
        window.history.back();
      } else if (user?.role === 'technician') {
        navigate('tech-jobs');
      } else if (user?.role === 'admin') {
        navigate('admin-requests');
      } else if (user?.role === 'customer') {
        navigate('service-requests');
      } else {
        navigate('home');
      }
    };

    const content = <ServiceRequestDetail requestId={currentParam} onBack={handleBack} onNavigate={navigate} />;

    if (user?.role === 'technician') {
      return (
        <TechnicianLayout currentPage="tech-jobs" onNavigate={navigate}>
          {content}
        </TechnicianLayout>
      );
    }
    if (user?.role === 'admin') {
      return (
        <AdminLayout currentPage="admin-requests" onNavigate={navigate}>
          {content}
        </AdminLayout>
      );
    }
    if (user?.role === 'customer') {
      return (
        <CustomerLayout currentPage="service-requests" onNavigate={navigate}>
          {content}
        </CustomerLayout>
      );
    }
    return (
      <PublicLayout currentPage="services" onNavigate={navigate}>
        <div className="py-8">{content}</div>
      </PublicLayout>
    );
  }

  // =========================================================================
  // SUPABASE PASSWORD RECOVERY GUARD
  // MUST execute BEFORE normal portal/persona routing is executed!
  // =========================================================================
  if (
    isPasswordRecoveryActive ||
    currentPage === 'reset-password' ||
    currentPage === 'reset-password-verifying'
  ) {
    return (
      <PublicLayout currentPage="reset-password" onNavigate={navigate}>
        <ResetPasswordPage
          onNavigate={(page, param) => {
            if (page !== 'reset-password') {
              try {
                sessionStorage.removeItem('techcare_password_recovery_active');
              } catch {}
              setIsPasswordRecoveryActive(false);
            }
            navigate(page, param);
          }}
          initialError={resetPasswordError}
        />
      </PublicLayout>
    );
  }

  // Customer Portal Views (Protected Routes)
  if (isCustomerPage) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-cyan-400">Verifying security session...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <PublicLayout currentPage="login" onNavigate={navigate}>
          <LoginPage onNavigate={navigate} />
        </PublicLayout>
      );
    }

    if (user.role !== 'customer') {
      return (
        <AccessRestricted
          requiredRole="customer"
          currentRole={user.role}
          currentUserName={user.full_name || user.email}
          onNavigate={navigate}
          onSwitchRole={switchRolePersona}
          onLogout={logout}
        />
      );
    }

    return (
      <CustomerLayout currentPage={currentPage} onNavigate={navigate}>
        {currentPage === 'customer-dashboard' && <CustomerDashboard onNavigate={navigate} />}
        {currentPage === 'my-devices' && <MyDevicesPage onNavigate={navigate} />}
        {currentPage === 'service-requests' && <CustomerRequestsPage onNavigate={navigate} />}
        {currentPage === 'service-history' && <CustomerRequestsPage onNavigate={navigate} isHistory={true} />}
        {currentPage === 'appointments' && <AppointmentsPage />}
        {currentPage === 'invoices' && <CustomerInvoicesPage />}
        {(currentPage === 'warranty' || currentPage === 'warranties') && <WarrantyPage onNavigate={navigate} />}
        {currentPage === 'messages' && <CustomerMessagesPage />}
        {currentPage === 'customer-profile' && <CustomerProfilePage />}
        {currentPage === 'notifications' && <NotificationsPage onNavigate={navigate} />}
      </CustomerLayout>
    );
  }

  // Technician Workbench Views (Protected Routes)
  if (isTechPage) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-emerald-400">Verifying technician session...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <PublicLayout currentPage="login" onNavigate={navigate}>
          <LoginPage onNavigate={navigate} />
        </PublicLayout>
      );
    }

    if (user.role !== 'technician') {
      return (
        <AccessRestricted
          requiredRole="technician"
          currentRole={user.role}
          currentUserName={user.full_name || user.email}
          onNavigate={navigate}
          onSwitchRole={switchRolePersona}
          onLogout={logout}
        />
      );
    }

    return (
      <TechnicianLayout currentPage={currentPage} onNavigate={navigate}>
        {currentPage === 'tech-dashboard' && <TechnicianDashboard onNavigate={navigate} />}
        {currentPage === 'tech-jobs' && <TechnicianJobsPage onNavigate={navigate} />}
        {currentPage === 'tech-schedule' && <TechnicianSchedulePage onNavigate={navigate} />}
        {currentPage === 'tech-customers' && <TechnicianCustomersPage onNavigate={navigate} />}
        {currentPage === 'tech-messages' && <TechnicianMessagesPage onNavigate={navigate} initialRequestId={currentParam} />}
        {currentPage === 'tech-performance' && <TechnicianPerformancePage />}
        {currentPage === 'tech-profile' && <TechnicianProfilePage />}
      </TechnicianLayout>
    );
  }

  // Business Admin Views (Protected Routes)
  if (isAdminPage) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#080d19] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-purple-400">Verifying administrator session...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <PublicLayout currentPage="login" onNavigate={navigate}>
          <LoginPage onNavigate={navigate} portal="admin" initialPortal="admin" />
        </PublicLayout>
      );
    }

    const userEmail = (user.email || '').toLowerCase().trim();
    if (user.role !== 'admin' || userEmail !== ADMIN_OWNER_EMAIL) {
      return (
        <AccessRestricted
          requiredRole="admin"
          currentRole={user.role}
          currentUserName={user.full_name || user.email}
          onNavigate={navigate}
          onSwitchRole={switchRolePersona}
          onLogout={logout}
        />
      );
    }

    return (
      <AdminLayout currentPage={currentPage} onNavigate={navigate}>
        {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={navigate} />}
        {currentPage === 'admin-requests' && <AdminRequestsPage onNavigate={navigate} />}
        {currentPage === 'admin-technicians' && <AdminTechniciansPage onNavigate={navigate} />}
        {currentPage === 'admin-customers' && <AdminCustomersPage onNavigate={navigate} />}
        {currentPage === 'admin-devices' && <AdminDevicesPage onNavigate={navigate} />}
        {currentPage === 'admin-services' && <AdminServicesPage />}
        {currentPage === 'admin-appointments' && <AdminAppointmentsPage onNavigate={navigate} />}
        {currentPage === 'admin-inventory' && <AdminInventoryPage />}
        {currentPage === 'admin-users' && <AdminUsersPage />}
        {currentPage === 'admin-invoices' && <AdminInvoicesPage />}
        {currentPage === 'admin-reviews' && <AdminReviewsPage onNavigate={navigate} />}
        {currentPage === 'admin-analytics' && <AdminAnalyticsPage />}
        {currentPage === 'admin-ai' && <AdminAIAssistantPage onNavigate={navigate} />}
        {currentPage === 'admin-settings' && <AdminSettingsPage />}
        {![
          'admin-dashboard',
          'admin-requests',
          'admin-technicians',
          'admin-customers',
          'admin-devices',
          'admin-services',
          'admin-appointments',
          'admin-inventory',
          'admin-users',
          'admin-invoices',
          'admin-reviews',
          'admin-analytics',
          'admin-ai',
          'admin-settings'
        ].includes(currentPage) && <AdminDashboard onNavigate={navigate} />}
      </AdminLayout>
    );
  }

  // Intercept authenticated non-admin users attempting to open admin-login
  if (currentPage === 'admin-login' && user && !isLoading) {
    const userEmail = (user.email || '').toLowerCase().trim();
    if (userEmail !== ADMIN_OWNER_EMAIL || user.role !== 'admin') {
      return (
        <AccessRestricted
          requiredRole="admin"
          currentRole={user.role}
          currentUserName={user.full_name || user.email}
          onNavigate={navigate}
          onSwitchRole={switchRolePersona}
          onLogout={logout}
        />
      );
    }
  }

  // Public & Auth Views
  const isAuthLogin = ['login', 'customer-login', 'tech-login', 'admin-login'].includes(currentPage);
  const isAuthRegister = ['register', 'customer-register', 'tech-register', 'admin-register'].includes(currentPage);

  const authLoginPortal =
    currentPage === 'tech-login'
      ? 'technician'
      : currentPage === 'admin-login'
      ? 'admin'
      : 'customer';

  const authRegisterPortal =
    currentPage === 'tech-register'
      ? 'technician'
      : currentPage === 'admin-register'
      ? 'admin'
      : 'customer';

  return (
    <PublicLayout currentPage={currentPage} onNavigate={navigate}>
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'services' && <ServicesPage onNavigate={navigate} />}
      {currentPage === 'how-it-works' && <HowItWorksPage onNavigate={navigate} />}
      {currentPage === 'about' && <AboutPage onNavigate={navigate} />}
      {currentPage === 'faq' && <FAQPage onNavigate={navigate} />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'reset-password' && (
        <ResetPasswordPage onNavigate={navigate} initialError={resetPasswordError} />
      )}
      {isAuthLogin && (
        <LoginPage
          onNavigate={navigate}
          initialPortal={authLoginPortal}
          initialMode={currentParam === 'forgot' ? 'forgot' : 'login'}
        />
      )}
      {isAuthRegister && <RegisterPage onNavigate={navigate} portal={authRegisterPortal} />}
      {!['home', 'services', 'how-it-works', 'about', 'faq', 'contact', 'reset-password'].includes(currentPage) &&
        !isAuthLogin &&
        !isAuthRegister && <HomePage onNavigate={navigate} />}
    </PublicLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
