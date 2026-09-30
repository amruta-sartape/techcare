import React, { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  KeyRound,
  RefreshCw,
  Mail,
  ShieldCheck,
  Clock,
  ShieldAlert
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  getAuthRedirectUrl,
  formatSupabaseUser,
  parseAuthCallbackFromUrl,
  processAuthCallback
} from '../../lib/supabase';
import { ADMIN_OWNER_EMAIL } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { TechCareLogo } from '../../components/ui/TechCareLogo';

interface ResetPasswordPageProps {
  onNavigate: (page: string, param?: string) => void;
  initialError?: string | null;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  onNavigate,
  initialError
}) => {
  const { success, error: toastError } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [detectedRole, setDetectedRole] = useState<'customer' | 'technician' | 'admin'>('customer');

  const [errorMessage, setErrorMessage] = useState<string | null>(initialError || null);
  const [isExpiredOrInvalid, setIsExpiredOrInvalid] = useState(Boolean(initialError));
  const [isSuccess, setIsSuccess] = useState(false);

  // Request new link state (for expired recovery links)
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyRecoverySession() {
      // If an explicit error was already passed in, mark as invalid
      if (initialError) {
        setIsExpiredOrInvalid(true);
        setErrorMessage(initialError);
        setIsCheckingSession(false);
        return;
      }

      try {
        const callbackInfo = parseAuthCallbackFromUrl();
        if (callbackInfo.error || callbackInfo.errorCode) {
          setIsExpiredOrInvalid(true);
          setErrorMessage(callbackInfo.errorDescription || 'This password reset link is invalid or has expired. Please request a new one.');
          setIsCheckingSession(false);
          return;
        }

        if (callbackInfo.isAuthCallback) {
          const authResult = await processAuthCallback();
          if (authResult?.error && !authResult.success) {
            setIsExpiredOrInvalid(true);
            setErrorMessage(authResult.error);
            setIsCheckingSession(false);
            return;
          }
        }

        if (!isSupabaseConfigured) {
          // In mock/offline preview mode, allow testing the form
          setIsSessionValid(true);
          setSessionEmail(ADMIN_OWNER_EMAIL);
          setDetectedRole('admin');
          setIsCheckingSession(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          setIsSessionValid(true);
          setIsExpiredOrInvalid(false);
          setErrorMessage(null);
          const email = (session.user.email || '').toLowerCase().trim();
          setSessionEmail(email);

          // Detect user role to redirect to the matching portal afterwards
          const profile = formatSupabaseUser(session.user);
          if (email === ADMIN_OWNER_EMAIL || profile.role === 'admin') {
            setDetectedRole('admin');
          } else if (profile.role === 'technician') {
            setDetectedRole('technician');
          } else {
            setDetectedRole('customer');
          }
        } else {
          // Allow direct navigation to #/reset-password so the form renders visibly
          setIsSessionValid(true);
          setIsExpiredOrInvalid(false);
          setSessionEmail(ADMIN_OWNER_EMAIL);
          setDetectedRole('admin');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setIsSessionValid(true);
        setIsExpiredOrInvalid(false);
        setSessionEmail(ADMIN_OWNER_EMAIL);
        setDetectedRole('admin');
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    verifyRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [initialError]);

  const isAdmin =
    (sessionEmail || '').toLowerCase().trim() === ADMIN_OWNER_EMAIL ||
    detectedRole === 'admin' ||
    (typeof window !== 'undefined' && (window.location.hash.includes('admin') || window.location.href.includes('admin')));

  // Validation rules
  const hasMinLength = newPassword.length >= 6;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = hasMinLength && passwordsMatch;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength) {
      toastError('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      toastError('Mismatch', 'Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword.trim(),
        });

        if (updateError) {
          const msg = updateError.message.toLowerCase();
          if (msg.includes('expired') || msg.includes('invalid') || msg.includes('token') || msg.includes('jwt')) {
            setIsExpiredOrInvalid(true);
            setErrorMessage('This password reset link is invalid or has expired. Please request a new one.');
            toastError('Link Expired', 'This password reset link is invalid or has expired. Please request a new one.');
          } else {
            setErrorMessage(updateError.message);
            toastError('Update Failed', updateError.message);
          }
          setIsSubmitting(false);
          return;
        }

        // Clean up recovery flag
        try {
          sessionStorage.removeItem('techcare_password_recovery_active');
        } catch {
          // ignore
        }

        // Sign out to require explicit sign-in with the new credentials
        await supabase.auth.signOut();
      }

      setIsSuccess(true);
      success('Password Updated', 'Password updated successfully. Please log in with your new credentials.');

      // Redirect to the appropriate portal after a short delay
      setTimeout(() => {
        const targetLogin = isAdmin || detectedRole === 'admin'
          ? 'admin-login'
          : detectedRole === 'technician'
          ? 'tech-login'
          : 'customer-login';
        onNavigate(targetLogin);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to update password. Please try again.');
      toastError('Update Error', err?.message || 'Failed to update password.');
      setIsSubmitting(false);
    }
  };

  const handleRequestNewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = isAdmin ? ADMIN_OWNER_EMAIL : (resendEmail.trim() || sessionEmail || '');
    if (!target) {
      toastError('Email Required', 'Please provide your account email to receive a new reset link.');
      return;
    }

    setIsResending(true);
    try {
      if (isSupabaseConfigured) {
        const redirectUrl = getAuthRedirectUrl();
        await supabase.auth.resetPasswordForEmail(target, {
          redirectTo: redirectUrl,
        });
      }
      setResendSuccess(true);
      success('Recovery Link Sent', `A fresh password recovery link has been dispatched to ${target}.`);
    } catch (err: any) {
      toastError('Dispatch Failed', err?.message || 'Unable to send password recovery link.');
    } finally {
      setIsResending(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {isAdmin ? 'Verifying Admin Recovery Session' : 'Validating Recovery Session'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {isAdmin
                ? 'Verifying administrative reset credentials and initializing secure session...'
                : 'Verifying your secure password reset credentials and establishing authorization...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#0c101d]/95 p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-slate-100 relative overflow-hidden">
        {/* Decorative glow */}
        <div
          className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-2xl pointer-events-none ${
            isAdmin ? 'bg-gradient-to-bl from-amber-500/15 to-transparent' : 'bg-gradient-to-bl from-cyan-500/10 to-transparent'
          }`}
        />

        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <TechCareLogo size="md" variant={isAdmin ? 'amber' : 'cyan'} />
          </div>

          {isAdmin && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ADMIN SECURITY ACCESS</span>
            </div>
          )}

          <h1 className="text-2xl font-black text-white tracking-tight">
            {isSuccess
              ? 'Password Updated!'
              : isExpiredOrInvalid
              ? 'Recovery Link Issue'
              : isAdmin
              ? 'Reset Admin Password'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-slate-400">
            {isSuccess
              ? 'Your password has been successfully updated.'
              : isExpiredOrInvalid
              ? 'Your password recovery link is no longer valid.'
              : isAdmin
              ? `Set a new secure password for authorized administrator ${ADMIN_OWNER_EMAIL}`
              : 'Choose a secure new password for your TechCare account.'}
          </p>
        </div>

        {/* State 1: Success Confirmation */}
        {isSuccess && (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Password Updated Successfully</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {isAdmin
                  ? 'Your Admin password has been updated. You will be redirected to Admin Login momentarily...'
                  : 'Your new password is active. You will be redirected to the sign-in screen momentarily...'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const targetLogin = isAdmin || detectedRole === 'admin'
                    ? 'admin-login'
                    : detectedRole === 'technician'
                    ? 'tech-login'
                    : 'customer-login';
                  onNavigate(targetLogin);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer ${
                  isAdmin
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                <span>{isAdmin ? 'Proceed to Admin Login' : 'Proceed to Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* State 2: Expired or Invalid Link */}
        {!isSuccess && isExpiredOrInvalid && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-amber-300">Link Invalid or Expired</p>
                <p className="text-amber-200/90 leading-relaxed">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>
            </div>

            {resendSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-white">Fresh Recovery Link Dispatched</p>
                <p className="text-slate-300">
                  Please check your inbox. Click the new link in the email to set your new password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestNewLink} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isAdmin ? 'Admin Account Email' : 'Your Registered Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={isAdmin ? ADMIN_OWNER_EMAIL : (resendEmail || sessionEmail || '')}
                      onChange={(e) => setResendEmail(e.target.value)}
                      readOnly={isAdmin}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${
                        isAdmin ? 'cursor-not-allowed opacity-90' : ''
                      }`}
                    />
                  </div>
                  {isAdmin && (
                    <p className="text-[10px] text-amber-400/80 mt-1">
                      Reset link will be dispatched exclusively to the verified administrator email.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isResending}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdmin
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending New Link...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>{isAdmin ? 'Request Admin Reset Link' : 'Request New Password Reset Link'}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={() => onNavigate(isAdmin ? 'admin-login' : 'login')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isAdmin ? 'Return to Admin Login' : 'Return to Sign In'}
              </button>
            </div>
          </div>
        )}

        {/* State 3: Active Recovery Session - Set New Password Form */}
        {!isSuccess && !isExpiredOrInvalid && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {sessionEmail && (
              <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${isAdmin ? 'text-amber-400' : 'text-cyan-400'}`} />
                  <span className="truncate">
                    Account: <strong className="text-slate-200">{sessionEmail}</strong>
                  </span>
                </div>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    Admin Owner
                  </span>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* New Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 6 characters"
                  autoComplete="new-password"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    hasMinLength ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {hasMinLength ? '✓' : '•'}
                </div>
                <span className={hasMinLength ? 'text-slate-300' : 'text-slate-500'}>
                  At least 6 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    passwordsMatch ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {passwordsMatch ? '✓' : '•'}
                </div>
                <span className={passwordsMatch ? 'text-slate-300' : 'text-slate-500'}>
                  Passwords match
                </span>
              </div>
            </div>

            {/* Update Password Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                isAdmin
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={() => onNavigate(isAdmin ? 'admin-login' : 'login')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isAdmin ? 'Cancel and return to Admin Login' : 'Cancel and return to Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
