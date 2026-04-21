import { useState, useEffect } from 'react';
import { getCurrentUser, getUserData } from '@/lib/auth';

interface User {
  id: number;
  email: string;
  name: string;
  role?: {
    name: string;
  };
  collegeId?: number;
  college?: {
    id: number;
    name: {
      en?: string;
      am?: string;
    } | string;
    code?: string;
  };
  departmentId?: number;
  department?: {
    id: number;
    name: string;
    code?: string;
  };
  avatar?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      // First check localStorage
      const cachedUser = getUserData();
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
        return;
      }

      // If not in cache, fetch from API
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  return { user, loading };
}
