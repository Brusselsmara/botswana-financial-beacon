
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
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // First attach the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const eventString = event.toString();
            // Check for both SIGNED_IN and SIGNED_UP events explicitly as strings
            if (eventString === 'SIGNED_IN' || eventString === 'SIGNED_UP') {
              console.log('Authentication event detected:', eventString);
              // Using timeout to avoid Supabase auth deadlocks
              setTimeout(() => {
                if (isMounted) {
                  console.log('Creating wallet after auth event');
                  ensureBlockchainWallet(currentSession.user.id)
                    .then(key => console.log('Wallet creation after auth event completed:', key ? 'success' : 'failed'));
                }
              }, 500);
            }
          }
          
          setLoading(false);
        }
      }
    );

    // Then check for existing session on load
    const checkExistingSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
          
          // If user is already logged in, ensure they have a blockchain wallet
          if (existingSession?.user) {
            console.log('Existing session found, creating wallet if needed');
            setTimeout(() => {
              if (isMounted) {
                ensureBlockchainWallet(existingSession.user.id)
                  .then(key => console.log('Wallet creation for existing session completed:', key ? 'success' : 'failed'));
              }
            }, 500);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkExistingSession();

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.user) {
        console.log('Sign in successful, navigating to dashboard');
        // Create wallet is now handled by auth state change listener
        navigate('/dashboard');
      }
      return { error };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data?.user) {
        console.log('User signed up successfully:', data.user.id);
        // Wallet creation is now handled by auth state change listener
        navigate('/dashboard');
      }
      return { data, error };
    } catch (error) {
      console.error('Error during signup:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
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
