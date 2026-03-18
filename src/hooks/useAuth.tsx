import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Department, DepartmentRole } from '@/types';
import { supabase, getCurrentUser, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasAccess: (department: Department) => boolean;
  hasRole: (roles: DepartmentRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabaseSignIn(email, password);
    if (!error) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    return { error };
  };

  const handleSignUp = async (email: string, password: string, userData: Partial<User>) => {
    const { error } = await supabaseSignUp(email, password, userData);
    return { error };
  };

  const handleSignOut = async () => {
    await supabaseSignOut();
    setUser(null);
  };

  const hasAccess = (department: Department): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.department === department;
  };

  const hasRole = (roles: DepartmentRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return roles.includes(user.role);
  };

  const refreshUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        hasAccess,
        hasRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
