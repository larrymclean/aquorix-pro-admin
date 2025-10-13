/*
 * File: DashboardPlaceholder.tsx
 * Path: src/pages/DashboardPlaceholder.tsx
 * Description: Simple dashboard placeholder showing user name, tier, and onboarding status
 * Author: AQUORIX Engineering (refined by ChatGPT)
 * Created: 2025-09-19
 * Last Updated: 2025-09-19
 * Status: Minimal, working placeholder — no churn, no drift
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  role: string;
  tier: string;
  email: string;
  onboarding_metadata?: {
    completion_percentage?: number;
    current_step?: number;
  };
  first_name?: string;
  last_name?: string;
}

const DashboardPlaceholder: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with your real supabaseUser.id from context/auth
    const supabaseUserId = localStorage.getItem("supabase_user_id");

    // LSM Debug
    console.log('📦 Found supabase_user_id in localStorage:', supabaseUserId);

    if (!supabaseUserId) {
      navigate('/login');
      return;
    }

    fetch(`/api/users/by-supabase-id/${supabaseUserId}`)
      .then(res => {
        if (res.status === 404) {
          navigate('/onboarding');
          return null;
        }
        return res.json();
      })
      .then((data: UserData | null) => {
        
        // LSM Debug
        console.log('📡 Dashboard API returned:', data);


        if (data) setUserData(data);
      })
      .catch(err => {
        console.error('Error loading user data:', err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard…</div>;
  }

  if (!userData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Account Setup Required</h2>
        <p>Your account needs to be set up in our system.</p>
        <button onClick={() => navigate('/onboarding')}>Complete Onboarding</button>
      </div>
    );
  }

  const firstName = userData.first_name || 'Pro';
  const completion = userData.onboarding_metadata?.completion_percentage || 0;
  const tier = userData.tier;

  // Friendly tier labels
  const tierLabel =
    tier === 'solo' ? 'Solo Professional' :
    tier === 'entrepreneur' ? 'Entrepreneur' :
    tier === 'dive_center' ? 'Dive Center' :
    tier === 'complex' ? 'Complex Operator' :
    tier === 'affiliate' ? 'Affiliate Partner' :
    tier || 'Unknown Tier';

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome, {firstName}!</h1>
      <p>Account Type: {tierLabel}</p>
      <p>Onboarding Status: {completion}% complete</p>

      {completion < 100 ? (
        <button onClick={() => navigate('/onboarding')}>Continue Setup</button>
      ) : (
        <div style={{ marginTop: '1rem', color: 'green' }}>
          ✓ Onboarding Complete — Dashboard coming soon
        </div>
      )}
    </div>
  );
};

export default DashboardPlaceholder;