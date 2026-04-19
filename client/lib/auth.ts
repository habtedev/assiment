// utils/auth.ts
export function getJwtToken() {
  if (typeof window !== 'undefined') {
    // Try to get token from cookie first
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    // Fallback to localStorage
    return localStorage.getItem('jwtToken');
  }
  return null;
}

export function isTokenValid(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

export function getUserData() {
  if (typeof window !== 'undefined') {
    // Check localStorage first (stored after login)
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed;
      } catch {
        return null;
      }
    }
    
    // Fallback to JWT token in cookies
    const token = getJwtToken();
    if (token) {
      if (!isTokenValid(token)) {
        return null;
      }
      
      try {
        // Decode JWT to get user data
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        
        return {
          id: decoded.userId,
          email: '', // Email not in JWT, would need to fetch from API
          name: 'Admin User', // Default name
          avatar: null,
        };
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    // Clear token cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
  }
}

export async function getCurrentUser() {
  const token = getJwtToken();
  if (!token) return null;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8500";

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      // Store in localStorage for faster access
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
