/*
  File: RequireAuth.tsx
  Path: src/components/RequireAuth.tsx
  Description: Updated to use AQUORIX backend for user role/tier authorization
  Author: AQUORIX Engineering
  Created: 2025-09-14
  Status: Updated to use AQUORIX API
*/

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedTiers?: string[];
}

interface AquorixUser {
  user_id: string;
  email: string;
  role: string;
  tier: string;
  is_active: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = [], 
  allowedTiers = [] 
}) => {
  const [user, setUser] = useState<AquorixUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [supabaseSession, setSupabaseSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check Supabase session (for authentication)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[RequireAuth] Session error:', sessionError);
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        if (!session?.user?.id) {
          console.log('[RequireAuth] No authenticated session');
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        setSupabaseSession(session);

        // 2. Get user role/tier from AQUORIX backend
        const response = await fetch(`http://localhost:3001/api/users/me?user_id=${session.user.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('[RequireAuth] User not found in AQUORIX database');
          } else {
            console.error('[RequireAuth] API error:', response.status);
          }
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        const userData: AquorixUser = await response.json();
        console.log('[RequireAuth] User data loaded:', userData);
        
        setUser(userData);
        setAuthChecked(true);

      } catch (error) {
        console.error('[RequireAuth] Auth check failed:', error);
        setAuthChecked(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking auth
  if (loading || !authChecked) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Authenticating...</div>
      </div>
    );
  }

  // Redirect to login if no Supabase session
  if (!supabaseSession) {
    return <Navigate to="/login" replace />;
  }

  // Show error if user not found in AQUORIX database
  if (!user) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc2626' 
      }}>
        <h2>Account Setup Required</h2>
        <p>Your account needs to be set up in our system.</p>
        <p>Please contact support or complete the onboarding process.</p>
        <button 
          onClick={() => window.location.href = '/onboarding'}
          style={{ 
            padding: '0.5rem 1rem', 
            marginTop: '1rem',
            backgroundColor: '#2574d9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Complete Onboarding
        </button>
      </div>
    );
  }

  // ✅ Only treat explicitly false as inactive
  if (user.is_active === false) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc2626' 
      }}>
        <h2>Account Inactive</h2>
        <p>Your account has been deactivated. Please contact support.</p>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn('[RequireAuth] Role not authorized:', user.role, 'Allowed:', allowedRoles);
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc2626' 
      }}>
        <h2>Not Authorized</h2>
        <p>You are not authorized to access this page.</p>
        <p>Required role: {allowedRoles.join(', ')}</p>
        <p>Your role: {user.role}</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{ 
            padding: '0.5rem 1rem', 
            marginTop: '1rem',
            backgroundColor: '#2574d9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Check tier authorization
  if (allowedTiers.length > 0 && !allowedTiers.includes(user.tier)) {
    console.warn('[RequireAuth] Tier not authorized:', user.tier, 'Allowed:', allowedTiers);
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc2626' 
      }}>
        <h2>Not Authorized</h2>
        <p>You are not authorized to access this page.</p>
        <p>Required tier: {allowedTiers.join(', ')}</p>
        <p>Your tier: {user.tier}</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{ 
            padding: '0.5rem 1rem', 
            marginTop: '1rem',
            backgroundColor: '#2574d9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // User is authenticated and authorized
  console.log('[RequireAuth] User authorized:', { role: user.role, tier: user.tier });
  return <>{children}</>;
};

export default RequireAuth;