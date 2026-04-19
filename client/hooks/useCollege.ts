import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

interface College {
  id: number;
  name: {
    en?: string;
    am?: string;
  } | string;
  code: string;
  description?: {
    en?: string;
    am?: string;
  } | string;
  email: string;
  phone: string;
  address?: {
    en?: string;
    am?: string;
  } | string;
  academicYear: string;
  status: string;
}

export function useCollege(collegeId?: number | null) {
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCollege() {
      if (!collegeId) {
        setCollege(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/colleges/${collegeId}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCollege(data);
        }
      } catch (error) {
        console.error('Error fetching college:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollege();
  }, [collegeId]);

  return { college, loading };
}
