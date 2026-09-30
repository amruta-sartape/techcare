import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole, ADMIN_OWNER_EMAIL } from '../types';
import { store } from '../services/store';
import {
  supabase,
  isSupabaseConfigured,
  getAuthRedirectUrl,
  formatSupabaseUser,
  processAuthCallback,
  parseAuthCallbackFromUrl,
  CURRENT_USER_KEY,
  ACTIVE_ROLE_KEY,
} from '../lib/supabase';

export interface RegisterResult {
  success: boolean;
  requiresEmailConfirmation?: boolean;
  error?: string;
}

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, passwordOrRole?: string, role?: UserRole) => Promise<boolean>;
  register: (data: {
    email: string;
    password?: string;
    full_name: string;
    role: UserRole;
    phone?: string;
    adminPasskey?: string;
  }) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  switchRolePersona: (role: UserRole) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize user and loading synchronously from storage for technician only; customer and admin require active Supabase session
  const [user, setUser] = useState<Profile | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.role === 'technician') {
          return parsed;
        }
      }
    } catch {
      // ignore parsing error
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuthSession() {
      try {
        const storedRole = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        let storedPersona: Profile | null = null;
        if (stored) {
          try {
            storedPersona = JSON.parse(stored);
          } catch {}
        }

        // Security check: If stored persona claims role === 'admin' but email !== ADMIN_OWNER_EMAIL, sanitize immediately
        if (storedPersona && storedPersona.role === 'admin' && storedPersona.email?.toLowerCase().trim() !== ADMIN_OWNER_EMAIL) {
          storedPersona.role = 'customer';
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(storedPersona));
          localStorage.setItem(ACTIVE_ROLE_KEY, 'customer');
        }

        // Check if there is an active password recovery flow in URL or sessionStorage
        const href = typeof window !== 'undefined' ? window.location.href : '';
        const isRecoveryActive =
          (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('techcare_password_recovery_active') === 'true') ||
          href.includes('type=recovery') ||
          href.includes('reset-password');

        if (isRecoveryActive) {
          try {
            sessionStorage.setItem('techcare_password_recovery_active', 'true');
          } catch {}
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        // If the user has an active technician persona, preserve it
        if (
          storedPersona &&
          storedPersona.role === 'technician' &&
          (storedRole === 'technician' || !storedRole)
        ) {
          if (isMounted) {
            setUser(storedPersona);
            setIsLoading(false);
          }
          return;
        }

        if (isSupabaseConfigured) {
          // Check if there is an active auth confirmation callback in the URL
          const callbackInfo = parseAuthCallbackFromUrl();
          if (callbackInfo.isAuthCallback) {
            const callbackResult = await processAuthCallback();
            if (callbackResult?.user && isMounted) {
              const formattedUser = formatSupabaseUser(callbackResult.user);
              setUser(formattedUser);
              localStorage.setItem(ACTIVE_ROLE_KEY, formattedUser.role);
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(formattedUser));
              setIsLoading(false);
              return;
            }
          }

          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Supabase getSession warning:', error.message);
          }

          const activeSbUser = data?.session?.user;
          if (activeSbUser && isMounted) {
            const sbEmail = (activeSbUser.email || '').toLowerCase().trim();
            if (sbEmail === ADMIN_OWNER_EMAIL) {
              const profile = formatSupabaseUser(activeSbUser, 'admin');
              setUser(profile);
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
              localStorage.setItem(ACTIVE_ROLE_KEY, 'admin');
              store.syncAuthenticatedUserProfile(profile);
              store.setActiveUser(profile);
              setIsLoading(false);
              return;
            }

            // Any other authenticated Supabase account cannot be admin
            const currentStoredRole = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;
            const safeRole: UserRole = currentStoredRole === 'admin' ? 'customer' : (currentStoredRole || undefined) as any;
            const profile = formatSupabaseUser(activeSbUser, safeRole);
            if (profile.role === 'admin') {
              profile.role = 'customer';
            }
            setUser(profile);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            localStorage.setItem(ACTIVE_ROLE_KEY, profile.role);
            store.syncAuthenticatedUserProfile(profile);
            setIsLoading(false);
            return;
          } else {
            // No active Supabase session. Clear any stale / falsified admin role
            if (storedPersona?.role === 'admin' || storedRole === 'admin') {
              storedPersona = null;
              localStorage.removeItem(CURRENT_USER_KEY);
              localStorage.removeItem(ACTIVE_ROLE_KEY);
            }
          }
        }

        // If no active Supabase session, only preserve technician persona
        if (storedPersona && storedPersona.role === 'technician' && isMounted) {
          setUser(storedPersona);
        } else if (isMounted) {
          setUser(null);
          localStorage.removeItem(CURRENT_USER_KEY);
          localStorage.removeItem(ACTIVE_ROLE_KEY);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (isMounted && !user) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuthSession();

    // Listen to real-time Supabase auth state transitions
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        // If this is a PASSWORD_RECOVERY event, mark session storage and do not execute normal persona/portal routing
        if (event === 'PASSWORD_RECOVERY') {
          try {
            sessionStorage.setItem('techcare_password_recovery_active', 'true');
          } catch {}
          return;
        }

        const activeRole = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        let activePersona: Profile | null = null;
        if (storedUser) {
          try {
            activePersona = JSON.parse(storedUser);
          } catch {}
        }

        // Preserve active technician persona across background token events
        if (
          activePersona &&
          activePersona.role === 'technician' &&
          (activeRole === 'technician' || !activeRole)
        ) {
          return;
        }

        if (session?.user) {
          const sbEmail = (session.user.email || '').toLowerCase().trim();
          if (sbEmail === ADMIN_OWNER_EMAIL) {
            const profile = formatSupabaseUser(session.user, 'admin');
            setUser(profile);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            localStorage.setItem(ACTIVE_ROLE_KEY, 'admin');
            store.syncAuthenticatedUserProfile(profile);
          } else {
            const profile = formatSupabaseUser(session.user, activeRole === 'admin' ? 'customer' : activeRole || undefined);
            if (profile.role === 'admin') {
              profile.role = 'customer';
            }
            setUser(profile);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            localStorage.setItem(ACTIVE_ROLE_KEY, profile.role);
            store.syncAuthenticatedUserProfile(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          if (activeRole !== 'technician') {
            setUser(null);
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(ACTIVE_ROLE_KEY);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    store.setActiveUser(user);
  }, [user]);

  const login = async (
    email: string,
    passwordOrRole?: string,
    preferredRole?: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      let password = passwordOrRole;
      let targetRole = preferredRole;

      // Backwards-compatibility check if second param was role instead of password
      if (passwordOrRole === 'customer' || passwordOrRole === 'technician' || passwordOrRole === 'admin') {
        targetRole = passwordOrRole as UserRole;
        password = undefined;
      }

      if (!password) {
        throw new Error('Password is required.');
      }

      const trimmedEmail = email.trim().toLowerCase();
      const techEmails = ['rohan.deshmukh@techcare.in'];

      // =========================================================================
      // 1. ADMIN AUTHENTICATION (STRICT SINGLE-OWNER ENFORCEMENT)
      // =========================================================================
      if (targetRole === 'admin' || trimmedEmail === ADMIN_OWNER_EMAIL) {
        if (trimmedEmail !== ADMIN_OWNER_EMAIL) {
          throw new Error(
            'Access Denied: Only the authorized Admin account (amrutasartape27@gmail.com) is permitted to access the Admin Portal.'
          );
        }

        if (!isSupabaseConfigured) {
          throw new Error('Authentication Error: Supabase Auth is required for Admin login.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_OWNER_EMAIL,
          password: password
        });

        if (error) {
          throw new Error(error.message || 'Invalid administrator credentials. Access denied.');
        }

        if (!data?.user || (data.user.email || '').toLowerCase().trim() !== ADMIN_OWNER_EMAIL) {
          await supabase.auth.signOut();
          throw new Error('Access Denied: Unauthorized admin session.');
        }

        const profile = formatSupabaseUser(data.user, 'admin');
        setUser(profile);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
        localStorage.setItem(ACTIVE_ROLE_KEY, 'admin');
        store.syncAuthenticatedUserProfile(profile);
        store.setActiveUser(profile);
        return true;
      }

      // =========================================================================
      // 2. TECHNICIAN AUTHENTICATION (UNTOUCHED AS REQUIRED)
      // =========================================================================
      if (targetRole === 'technician' || techEmails.includes(trimmedEmail)) {
        let sbProfile: Profile | null = null;
        let sbError: any = null;

        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password: password
            });
            if (error) {
              sbError = error;
            } else if (data?.user) {
              sbProfile = formatSupabaseUser(data.user, 'technician');
            }
          } catch (err: any) {
            sbError = err;
          }
        }

        if (sbProfile) {
          const isAllowedTech = sbProfile.role === 'technician' || techEmails.includes(trimmedEmail);
          if (!isAllowedTech) {
            await supabase.auth.signOut();
            throw new Error(
              'Access Denied: Certified Hardware Technician credentials required. Ordinary accounts cannot access the Technician Workbench.'
            );
          }
          sbProfile.role = 'technician';
          localStorage.setItem(ACTIVE_ROLE_KEY, 'technician');
          setUser(sbProfile);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sbProfile));
          store.syncAuthenticatedUserProfile(sbProfile);
          store.setActiveUser(sbProfile);
          return true;
        }

        // Demo / Local Fallback for technician workbench only
        const allProfiles = store.getProfiles();
        const existingUser = allProfiles.find((p) => p.email.toLowerCase() === trimmedEmail);
        const isDemoPass = password === 'demo123456' || password === 'password123' || password.length >= 6;

        if (techEmails.includes(trimmedEmail) || (existingUser && existingUser.role === 'technician') || isDemoPass) {
          const profile: Profile = existingUser || {
            id: 'user-tech-1',
            user_id: 'auth-tech-1',
            email: trimmedEmail,
            full_name: trimmedEmail === 'rohan.deshmukh@techcare.in' ? 'Rohan Deshmukh' : trimmedEmail.split('@')[0],
            role: 'technician',
            phone: '+91 94220 00000',
            created_at: new Date().toISOString()
          };

          localStorage.setItem(ACTIVE_ROLE_KEY, 'technician');
          setUser(profile);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
          store.syncAuthenticatedUserProfile(profile);
          store.setActiveUser(profile);
          return true;
        }

        if (sbError) {
          throw sbError;
        }
        throw new Error('Invalid technician credentials. Please verify your email and password.');
      }

      // =========================================================================
      // 3. CUSTOMER AUTHENTICATION (STRICT REAL SUPABASE AUTHENTICATION ONLY)
      // Never allow login based on frontend state, dummy credentials, or mock auth
      // =========================================================================
      if (!isSupabaseConfigured) {
        throw new Error('Supabase authentication service is not configured. Please contact the administrator.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password
      });

      if (error || !data?.user || !data?.session) {
        throw new Error('Invalid email or password.');
      }

      // Verify that the authenticated user has the Customer role/profile
      const profile = formatSupabaseUser(data.user, 'customer');

      if (profile.role !== 'customer') {
        await supabase.auth.signOut();
        throw new Error(
          profile.role === 'admin'
            ? 'Access Denied: Administrative account detected. Please use the Admin Portal login.'
            : 'Access Denied: Technician account detected. Please use the Technician Workbench login.'
        );
      }

      // Establish authenticated customer session
      localStorage.setItem(ACTIVE_ROLE_KEY, 'customer');
      setUser(profile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      store.syncAuthenticatedUserProfile(profile);
      store.setActiveUser(profile);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password?: string;
    full_name: string;
    role: UserRole;
    phone?: string;
    adminPasskey?: string;
  }): Promise<RegisterResult> => {
    setIsLoading(true);
    try {
      const trimmedEmail = data.email.trim().toLowerCase();

      // Security constraint: Public Admin registration is completely disabled
      if (data.role === 'admin' || trimmedEmail === ADMIN_OWNER_EMAIL) {
        return {
          success: false,
          error: 'Registration Prohibited: Public Admin registration is disabled. Administrative access is restricted to the single owner account.'
        };
      }

      if (!trimmedEmail || !data.password) {
        return { success: false, error: 'Email and password are required.' };
      }

      if (isSupabaseConfigured) {
        const redirectUrl = getAuthRedirectUrl();

        const { data: signUpData, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: data.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: data.full_name.trim(),
              role: data.role || 'customer',
              phone: data.phone?.trim() || ''
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (signUpData.session && signUpData.user) {
          const profile = formatSupabaseUser(signUpData.user, data.role);
          setUser(profile);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
          localStorage.setItem(ACTIVE_ROLE_KEY, data.role);
          store.syncAuthenticatedUserProfile(profile);
          store.setActiveUser(profile);
          return { success: true, requiresEmailConfirmation: false };
        } else if (signUpData.user) {
          return { success: true, requiresEmailConfirmation: true };
        }
      }

      // Local / Offline fallback registration
      const newProfile: Profile = {
        id: `user-${Date.now()}`,
        user_id: `auth-${Date.now()}`,
        email: trimmedEmail,
        full_name: data.full_name.trim(),
        role: data.role || 'customer',
        phone: data.phone?.trim() || '+91 94220 00000',
        created_at: new Date().toISOString()
      };

      store.addUser(newProfile);
      setUser(newProfile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));
      localStorage.setItem(ACTIVE_ROLE_KEY, newProfile.role);
      store.setActiveUser(newProfile);
      return { success: true, requiresEmailConfirmation: false };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('SignOut error:', err);
    } finally {
      setUser(null);
      store.setActiveUser(null);
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(ACTIVE_ROLE_KEY);
      localStorage.removeItem('techcare-supabase-auth');
      setIsLoading(false);
    }
  };

  const switchRolePersona = (targetRole: UserRole) => {
    // Under NO circumstances can anyone switch persona TO admin
    if (targetRole === 'admin') {
      console.warn('Unauthorized: Persona switching to Admin is strictly forbidden.');
      return;
    }
    // Only the verified administrator is allowed to test persona switching for preview/audit
    if (user?.role !== 'admin' || user.email?.toLowerCase().trim() !== ADMIN_OWNER_EMAIL) {
      console.warn('Unauthorized persona switch rejected');
      return;
    }
    const profiles = store.getProfiles();
    const persona = profiles.find((p) => p.role === targetRole) || profiles[0];
    localStorage.setItem(ACTIVE_ROLE_KEY, targetRole);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(persona));
    setUser(persona);
    store.syncAuthenticatedUserProfile(persona);
    store.setActiveUser(persona);
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    if (!user) return;
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.updateUser({
          data: {
            full_name: updates.full_name || user.full_name,
            phone: updates.phone !== undefined ? updates.phone : user.phone,
            ...(updates.avatar_url ? { avatar_url: updates.avatar_url } : {})
          }
        });
      }
    } catch (err) {
      console.warn('Supabase updateUser error:', err);
    }
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    store.updateProfile(user.id, updates);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRolePersona,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
