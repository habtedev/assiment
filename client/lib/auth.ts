// utils/auth.ts
export function getJwtToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwtToken');
  }
  return null;
}
