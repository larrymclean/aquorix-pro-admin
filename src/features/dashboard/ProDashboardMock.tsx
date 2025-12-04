import React from 'react';
import {
  CalendarCheck,
  Waves,
  Users as UsersIcon,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { MOCK_DASHBOARD_OVERVIEW } from './mockData';

const ProDashboardMock: React.FC = () => {
  const { metrics } = MOCK_DASHBOARD_OVERVIEW;

  return (
    <div className="aqx-main-inner">
      <div className="aqx-main-header">
        <h1>Pro Dashboard</h1>
        <p>Welcome back. Here’s what’s happening in your operation today.</p>
      </div>

      {/* METRIC CARDS */}
      <div className="aqx-metric-grid">
        {/* Upcoming bookings */}
        <div className="aqx-card aqx-metric-card">
          <div className="aqx-metric-header">
            <div className="aqx-metric-title">Upcoming bookings</div>
            <div className="aqx-metric-icon-pill">
              <CalendarCheck />
            </div>
          </div>
          <div className="aqx-metric-value">{metrics.upcomingBookings7d}</div>
          <div className="aqx-metric-subtitle">Next 7 days</div>
        </div>

        {/* Dives today */}
        <div className="aqx-card aqx-metric-card">
          <div className="aqx-metric-header">
            <div className="aqx-metric-title">Dives today</div>
            <div className="aqx-metric-icon-pill">
              <Waves />
            </div>
          </div>
          <div className="aqx-metric-value">{metrics.divesToday}</div>
          <div className="aqx-metric-subtitle">Scheduled</div>
        </div>

        {/* Unique divers this week */}
        <div className="aqx-card aqx-metric-card">
          <div className="aqx-metric-header">
            <div className="aqx-metric-title">Unique divers</div>
            <div className="aqx-metric-icon-pill">
              <UsersIcon />
            </div>
          </div>
          <div className="aqx-metric-value">{metrics.uniqueDiversThisWeek}</div>
          <div className="aqx-metric-subtitle">This week</div>
        </div>
      </div>

      {/* SCHEDULE CARD */}
      <div className="aqx-card aqx-schedule-card">
        <div className="aqx-schedule-header">
          <div className="aqx-schedule-title">Today’s Schedule</div>
          <button className="aqx-btn-secondary">
            <CalendarIcon />
            <span>View full calendar</span>
          </button>
        </div>
        <div className="aqx-schedule-body">
          This is a placeholder. In the live app, this panel will render the
          <span> next departures, call times, and roster counts</span> from
          <code> /api/v3/booking/schedules/:operatorId</code>. Use this mock to
          refine spacing, typography, and card behavior before wiring real data.
        </div>
      </div>
    </div>
  );
};

export default ProDashboardMock;