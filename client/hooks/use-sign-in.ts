"use client"
// hooks/use-sign-in.ts
import { useState } from 'react';

interface UseSignInProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
}

export const useSignIn = ({ onSignIn, onResetPassword }: UseSignInProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSignIn(values.email, values.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (values: { email: string }) => {
    setIsSubmitting(true);
    try {
      await onResetPassword(values.email);
      return true;
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSignIn,
    handleResetPassword,
    isSubmitting,
    error,
  };
};