import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile, UserRole, ADMIN_OWNER_EMAIL } from '../types';
import { store } from '../services/store';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const procEnv = typeof process !== 'undefined' ? process.env : undefined;

const supabaseUrl: string =
  (metaEnv && (metaEnv.VITE_SUPABASE_URL as string)) ||
  (procEnv && procEnv.VITE_SUPABASE_URL) ||
  '';

const supabaseAnonKey: string =
  (metaEnv && (metaEnv.VITE_SUPABASE_ANON_KEY as string)) ||
  (procEnv && procEnv.VITE_SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Supabase Client initialized with session persistence
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://ogeafyppgeccbmtuavxj.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'dummy-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'techcare-supabase-auth',
    },
  }
);

export function getSupabase(): SupabaseClient {
  return supabase;
}

export const CURRENT_USER_KEY = 'techcare_current_user';
export const ACTIVE_ROLE_KEY = 'techcare_active_role';

/**
 * Resolves the application runtime origin and path dynamically.
 * Works seamlessly across development, preview URLs, shared links, and custom domains.
 * Avoids hardcoded localhost.
 */
export function getAuthRedirectUrl(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const origin = window.location.origin;
  let pathname = window.location.pathname;
  if (pathname.endsWith('.html')) {
    pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
  }
  if (!pathname.endsWith('/')) {
    pathname = `${pathname}/`;
  }
  return `${origin}${pathname}`;
}

/**
 * Formats a Supabase user object into a TechCare user profile.
 */
export function formatSupabaseUser(sbUser: any, overrideRole?: UserRole): Profile {
  const metadata = sbUser.user_metadata || {};
  const email = (sbUser.email || '').toLowerCase().trim();
  const fullName =
    metadata.full_name ||
    metadata.name ||
    (sbUser.email ? sbUser.email.split('@')[0] : 'Customer');

  let role: UserRole = overrideRole || (metadata.role as UserRole) || 'customer';

  // Strict Admin Authorization Gate:
  // ONLY amrutasartape27@gmail.com can ever hold or obtain the admin role.
  if (role === 'admin') {
    if (email !== ADMIN_OWNER_EMAIL) {
      role = 'customer';
    }
  } else if (email === ADMIN_OWNER_EMAIL) {
    role = 'admin';
  }

  return {
    id: sbUser.id,
    user_id: sbUser.id,
    email: sbUser.email || '',
    full_name: fullName,
    role: role,
    phone: metadata.phone || sbUser.phone || '',
    avatar_url:
      metadata.avatar_url ||
      (role === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
    created_at: sbUser.created_at || new Date().toISOString(),
  };
}

export interface AuthCallbackInfo {
  isAuthCallback: boolean;
  isRecovery: boolean;
  type: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  tokenHash: string | null;
  error: string | null;
  errorCode: string | null;
  errorDescription: string | null;
}

/**
 * Parses auth callback parameters (hash tokens, PKCE code, OTP tokens, errors)
 * from the URL without altering the current route state.
 */
export function parseAuthCallbackFromUrl(urlStr?: string): AuthCallbackInfo {
  if (typeof window === 'undefined' && !urlStr) {
    return {
      isAuthCallback: false,
      isRecovery: false,
      type: null,
      accessToken: null,
      refreshToken: null,
      code: null,
      tokenHash: null,
      error: null,
      errorCode: null,
      errorDescription: null,
    };
  }

  try {
    const rawUrl = urlStr || (typeof window !== 'undefined' ? window.location.href : '');
    const url = new URL(rawUrl);

    // Collect all parameters across standard searchParams and any hash segments (e.g. #customer-profile#access_token=...)
    const combinedParams = new URLSearchParams(url.search);

    const fullHash = url.hash.replace(/^#/, '');
    const hashSegments = fullHash.split('#').filter(Boolean);
    for (const segment of hashSegments) {
      const cleanSegment = segment.startsWith('?') ? segment.substring(1) : segment;
      if (cleanSegment.includes('=')) {
        const sp = new URLSearchParams(cleanSegment);
        for (const [k, v] of sp.entries()) {
          if (!combinedParams.has(k)) {
            combinedParams.set(k, v);
          }
        }
      }
    }

    const accessToken = combinedParams.get('access_token');
    const refreshToken = combinedParams.get('refresh_token');
    const code = combinedParams.get('code');
    const tokenHash =
      combinedParams.get('token_hash') ||
      combinedParams.get('token');
    const type = combinedParams.get('type');

    const error = combinedParams.get('error');
    const errorCode = combinedParams.get('error_code');
    const rawErrorDesc = combinedParams.get('error_description');
    const errorDescription = rawErrorDesc
      ? decodeURIComponent(rawErrorDesc.replace(/\+/g, ' '))
      : null;

    const isRecovery = Boolean(
      type === 'recovery' ||
      combinedParams.get('type') === 'recovery' ||
      rawUrl.includes('type=recovery') ||
      rawUrl.includes('reset-password') ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('techcare_password_recovery_active') === 'true') ||
      (Boolean(error || errorCode) && (rawUrl.includes('type=recovery') || rawUrl.includes('recovery') || rawUrl.includes('password')))
    );

    const isAuthCallback = Boolean(
      accessToken ||
      code ||
      tokenHash ||
      error ||
      errorCode ||
      isRecovery ||
      (type && ['signup', 'recovery', 'email_change', 'magiclink', 'invite'].includes(type))
    );

    return {
      isAuthCallback,
      isRecovery,
      type: isRecovery ? 'recovery' : type,
      accessToken,
      refreshToken,
      code,
      tokenHash,
      error,
      errorCode,
      errorDescription,
    };
  } catch {
    return {
      isAuthCallback: false,
      isRecovery: false,
      type: null,
      accessToken: null,
      refreshToken: null,
      code: null,
      tokenHash: null,
      error: null,
      errorCode: null,
      errorDescription: null,
    };
  }
}

export interface AuthCallbackResult {
  handled: boolean;
  success: boolean;
  isRecovery?: boolean;
  message?: string;
  error?: string;
  targetPage: string;
  user?: Profile;
}

let inFlightAuthCallbackPromise: Promise<AuthCallbackResult | null> | null = null;
let cachedAuthCallbackResult: AuthCallbackResult | null = null;

// Global listener for Supabase PASSWORD_RECOVERY event
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      try {
        sessionStorage.setItem('techcare_password_recovery_active', 'true');
      } catch {
        // ignore
      }
      window.dispatchEvent(new CustomEvent('techcare_password_recovery', { detail: { session } }));
    }
  });
}

/**
 * Verifies email confirmation or auth callback tokens/code, establishes the
 * user session, persists the profile, and determines the target redirect page.
 */
export async function processAuthCallback(): Promise<AuthCallbackResult | null> {
  if (typeof window === 'undefined') return null;
  if (cachedAuthCallbackResult) return cachedAuthCallbackResult;
  if (inFlightAuthCallbackPromise) return inFlightAuthCallbackPromise;

  inFlightAuthCallbackPromise = (async (): Promise<AuthCallbackResult | null> => {
    const callbackInfo = parseAuthCallbackFromUrl();
    if (!callbackInfo.isAuthCallback) {
      return null;
    }

    const isRecoveryFlow =
      callbackInfo.isRecovery ||
      callbackInfo.type === 'recovery' ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('techcare_password_recovery_active') === 'true');

    // Handle error returned by Supabase auth server
    if (callbackInfo.error || callbackInfo.errorCode || callbackInfo.errorDescription) {
      const isRecoveryError =
        isRecoveryFlow ||
        callbackInfo.errorCode === 'otp_expired' ||
        (callbackInfo.errorDescription &&
          (callbackInfo.errorDescription.toLowerCase().includes('recovery') ||
            callbackInfo.errorDescription.toLowerCase().includes('password') ||
            callbackInfo.errorDescription.toLowerCase().includes('expired')));

      const message = isRecoveryError
        ? 'This password reset link is invalid or has expired. Please request a new one.'
        : callbackInfo.errorDescription ||
          (callbackInfo.errorCode === 'otp_expired'
            ? 'Your email confirmation link has expired. Please sign in or request a new link.'
            : 'Email confirmation link is invalid or has already been used.');

      const result: AuthCallbackResult = {
        handled: true,
        success: false,
        error: message,
        targetPage: isRecoveryError ? 'reset-password' : 'login',
        isRecovery: isRecoveryError,
      };
      cachedAuthCallbackResult = result;
      return result;
    }

    try {
      // 1. PKCE Authorization Code Exchange (when ?code=... is present)
      if (callbackInfo.code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(callbackInfo.code);
          if (!error && data?.session?.user) {
            const profile = formatSupabaseUser(data.session.user);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            store.syncAuthenticatedUserProfile(profile);

            if (isRecoveryFlow) {
              try {
                sessionStorage.setItem('techcare_password_recovery_active', 'true');
              } catch {}
              const result: AuthCallbackResult = {
                handled: true,
                success: true,
                message: 'Recovery session authenticated. Please set your new password.',
                targetPage: 'reset-password',
                isRecovery: true,
                user: profile,
              };
              cachedAuthCallbackResult = result;
              return result;
            }

            const targetPage =
              profile.role === 'technician'
                ? 'tech-dashboard'
                : profile.role === 'admin'
                ? 'admin-dashboard'
                : 'customer-dashboard';

            const result: AuthCallbackResult = {
              handled: true,
              success: true,
              message: 'Your email has been verified! Welcome to TechCare.',
              targetPage,
              user: profile,
            };
            cachedAuthCallbackResult = result;
            return result;
          } else if (error && isRecoveryFlow) {
            const result: AuthCallbackResult = {
              handled: true,
              success: false,
              error: 'This password reset link is invalid or has expired. Please request a new one.',
              targetPage: 'reset-password',
              isRecovery: true,
            };
            cachedAuthCallbackResult = result;
            return result;
          }
        } catch (exchangeErr: any) {
          console.warn('exchangeCodeForSession notice:', exchangeErr?.message);
          if (isRecoveryFlow) {
            const result: AuthCallbackResult = {
              handled: true,
              success: false,
              error: 'This password reset link is invalid or has expired. Please request a new one.',
              targetPage: 'reset-password',
              isRecovery: true,
            };
            cachedAuthCallbackResult = result;
            return result;
          }
        }
      }

      // 2. Token Hash OTP Verification (when ?token_hash=... is present)
      if (callbackInfo.tokenHash) {
        try {
          const verifyType = (callbackInfo.type as any) || (isRecoveryFlow ? 'recovery' : 'email');
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: callbackInfo.tokenHash,
            type: verifyType,
          });
          if (!error && data?.session?.user) {
            const profile = formatSupabaseUser(data.session.user);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            store.syncAuthenticatedUserProfile(profile);

            if (isRecoveryFlow || verifyType === 'recovery') {
              try {
                sessionStorage.setItem('techcare_password_recovery_active', 'true');
              } catch {}
              const result: AuthCallbackResult = {
                handled: true,
                success: true,
                message: 'Recovery session authenticated. Please set your new password.',
                targetPage: 'reset-password',
                isRecovery: true,
                user: profile,
              };
              cachedAuthCallbackResult = result;
              return result;
            }

            const targetPage =
              profile.role === 'technician'
                ? 'tech-dashboard'
                : profile.role === 'admin'
                ? 'admin-dashboard'
                : 'customer-dashboard';

            const result: AuthCallbackResult = {
              handled: true,
              success: true,
              message: 'Your email has been verified! Welcome to TechCare.',
              targetPage,
              user: profile,
            };
            cachedAuthCallbackResult = result;
            return result;
          } else if (error && isRecoveryFlow) {
            const result: AuthCallbackResult = {
              handled: true,
              success: false,
              error: 'This password reset link is invalid or has expired. Please request a new one.',
              targetPage: 'reset-password',
              isRecovery: true,
            };
            cachedAuthCallbackResult = result;
            return result;
          }
        } catch (otpErr: any) {
          console.warn('verifyOtp notice:', otpErr?.message);
          if (isRecoveryFlow) {
            const result: AuthCallbackResult = {
              handled: true,
              success: false,
              error: 'This password reset link is invalid or has expired. Please request a new one.',
              targetPage: 'reset-password',
              isRecovery: true,
            };
            cachedAuthCallbackResult = result;
            return result;
          }
        }
      }

      // 3. Hash Access Token & Refresh Token (when #access_token=... is present)
      if (callbackInfo.accessToken && callbackInfo.refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: callbackInfo.accessToken,
            refresh_token: callbackInfo.refreshToken,
          });
          if (!error && data?.session?.user) {
            const profile = formatSupabaseUser(data.session.user);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            store.syncAuthenticatedUserProfile(profile);

            if (isRecoveryFlow || callbackInfo.type === 'recovery') {
              try {
                sessionStorage.setItem('techcare_password_recovery_active', 'true');
              } catch {}
              const result: AuthCallbackResult = {
                handled: true,
                success: true,
                message: 'Recovery session verified. Please set your new password.',
                targetPage: 'reset-password',
                isRecovery: true,
                user: profile,
              };
              cachedAuthCallbackResult = result;
              return result;
            }

            const targetPage =
              profile.role === 'technician'
                ? 'tech-dashboard'
                : profile.role === 'admin'
                ? 'admin-dashboard'
                : 'customer-dashboard';

            const result: AuthCallbackResult = {
              handled: true,
              success: true,
              message: 'Your email has been verified! Welcome to TechCare.',
              targetPage,
              user: profile,
            };
            cachedAuthCallbackResult = result;
            return result;
          } else if (error && isRecoveryFlow) {
            const result: AuthCallbackResult = {
              handled: true,
              success: false,
              error: 'This password reset link is invalid or has expired. Please request a new one.',
              targetPage: 'reset-password',
              isRecovery: true,
            };
            cachedAuthCallbackResult = result;
            return result;
          }
        } catch (setSessionErr: any) {
          console.warn('setSession notice:', setSessionErr?.message);
        }
      }

      // 4. Fallback check: check getSession() in case Supabase auto-initialized the session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        const profile = formatSupabaseUser(sessionData.session.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
        store.syncAuthenticatedUserProfile(profile);

        if (isRecoveryFlow) {
          try {
            sessionStorage.setItem('techcare_password_recovery_active', 'true');
          } catch {}
          const result: AuthCallbackResult = {
            handled: true,
            success: true,
            message: 'Recovery session verified. Please set your new password.',
            targetPage: 'reset-password',
            isRecovery: true,
            user: profile,
          };
          cachedAuthCallbackResult = result;
          return result;
        }

        const targetPage =
          profile.role === 'technician'
            ? 'tech-dashboard'
            : profile.role === 'admin'
            ? 'admin-dashboard'
            : 'customer-dashboard';

        const result: AuthCallbackResult = {
          handled: true,
          success: true,
          message: 'Your email has been verified! Welcome to TechCare.',
          targetPage,
          user: profile,
        };
        cachedAuthCallbackResult = result;
        return result;
      }

      // 5. Verification was attempted for recovery but no session was formed
      if (isRecoveryFlow) {
        const result: AuthCallbackResult = {
          handled: true,
          success: false,
          error: 'This password reset link is invalid or has expired. Please request a new one.',
          targetPage: 'reset-password',
          isRecovery: true,
        };
        cachedAuthCallbackResult = result;
        return result;
      }

      // 6. Verification succeeded on the server, but no active session created (user should sign in)
      const result: AuthCallbackResult = {
        handled: true,
        success: true,
        message: 'Your email has been verified! Please sign in with your credentials.',
        targetPage: 'login',
      };
      cachedAuthCallbackResult = result;
      return result;
    } catch (err: any) {
      console.warn('Auth callback processing error:', err);
      const result: AuthCallbackResult = {
        handled: true,
        success: false,
        error: isRecoveryFlow
          ? 'This password reset link is invalid or has expired. Please request a new one.'
          : err?.message || 'Verification could not be completed.',
        targetPage: isRecoveryFlow ? 'reset-password' : 'login',
        isRecovery: isRecoveryFlow,
      };
      cachedAuthCallbackResult = result;
      return result;
    } finally {
      inFlightAuthCallbackPromise = null;
    }
  })();

  return inFlightAuthCallbackPromise;
}
