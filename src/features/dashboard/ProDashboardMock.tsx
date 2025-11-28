import React from 'react';
import { ProDashboardShell } from './ProDashboardShell';
import { MetricCard } from './components/MetricCard';

export const ProDashboardMock: React.FC = () => {
  // TODO: Replace hard-coded tier/operatorName with GET /api/v3/users/me
  const tier: 1 | 2 | 3 = 2;
  const operatorName = 'Stonefish Diving · Aqaba';

  // TODO: Replace mock metrics with GET /api/v3/metrics/dashboard-summary
  const metrics = {
    upcomingBookings: 12,
    divesToday: 3,
    uniqueDiversThisWeek: 18,
  };

  return (
    <ProDashboardShell tier={tier} operatorName={operatorName}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--aqx-slate-light)' }}>
            Welcome back. Here’s what’s happening in your operation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <MetricCard
            title="Upcoming Bookings"
            value={metrics.upcomingBookings}
            subtitle="Next 7 days"
          />
          <MetricCard
            title="Dives Today"
            value={metrics.divesToday}
            subtitle="Scheduled"
          />
          <MetricCard
            title="Unique Divers"
            value={metrics.uniqueDiversThisWeek}
            subtitle="This week"
          />
        </div>

        <div className="aqx-card" style={{ padding: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Today’s Schedule</h2>
          <p style={{ fontSize: 14, color: 'var(--aqx-slate-light)' }}>
            Schedule widget will be integrated here via /api/v3/booking/schedules/:operatorId.
          </p>
        </div>
      </div>
    </ProDashboardShell>
  );
};