// useSignIn.ts
// Best practice: Separate authentication logic from UI
import { useState } from 'react';

interface UseSignInReturn {
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export function useSignIn(): UseSignInReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      await new Promise(res => setTimeout(res, 1000));
      
      // Backend handles token storage in cookies
      // No need to store in localStorage
      
      // throw new Error('Invalid credentials'); // Example error
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real Google sign-in logic
      await new Promise(res => setTimeout(res, 1000));
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real reset password logic
      await new Promise(res => setTimeout(res, 1000));
    } catch (err: any) {
      setError(err.message || 'Reset password failed');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, signIn, signInWithGoogle, resetPassword };
}
