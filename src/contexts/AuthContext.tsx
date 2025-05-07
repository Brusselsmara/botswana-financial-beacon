
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { getOrCreateBlockchainWallet } from '@/services/blockchainService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This function creates a blockchain wallet for a user after signup/signin
  const ensureBlockchainWallet = async (userId: string) => {
    try {
      console.log('Creating blockchain wallet for user:', userId);
      const { publicKey } = await getOrCreateBlockchainWallet();
      console.log('Blockchain wallet created or retrieved:', publicKey);
      toast.success('Blockchain wallet is ready');
      return publicKey;
    } catch (error) {
      console.error('Error ensuring blockchain wallet:', error);
      toast.error('Failed to create blockchain wallet');
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // IMPORTANT: Check for specific events to create wallet
        // Use string comparison instead of type comparison to avoid TypeScript errors
        if (event === 'SIGNED_IN' || event.toString() === 'SIGNED_UP') {
          if (session?.user) {
            // Use setTimeout to avoid Supabase deadlocks
            setTimeout(() => {
              console.log('Creating wallet after event:', event);
              ensureBlockchainWallet(session.user.id);
            }, 0);
          }
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is already logged in, ensure they have a blockchain wallet
      if (session?.user) {
        setTimeout(() => {
          ensureBlockchainWallet(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) navigate('/dashboard');
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error) {
        console.log('User signed up successfully:', data.user?.id);
        navigate('/dashboard');
      }
      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
