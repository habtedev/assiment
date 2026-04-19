// useSignIn.ts
// Best practice: Separate authentication logic from UI
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

interface UseSignInReturn {
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export function useSignIn(): UseSignInReturn {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      // Redirect to dashboard based on user role
      if (data.user.role?.name === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (data.user.role?.name === 'COLLEGE' || data.user.role?.name === 'COLLEGE_ADMIN') {
        router.push('/dashboard/college');
      } else if (data.user.role?.name === 'HEAD') {
        router.push('/dashboard/head');
      } else if (data.user.role?.name === 'TEACHER') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
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
