import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if session cookie exists
        const hasSessionCookie = document.cookie.includes('admin_session=');
        
        if (!hasSessionCookie) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Make a quick API call to verify the session is still valid
        const response = await fetch('/api/admin/auth/verify', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Session is invalid, clear any cookies and redirect
          setIsAuthenticated(false);
          // Don't redirect immediately here, let the component handle it
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
}