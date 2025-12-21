import { DashboardOverviewResponse } from './types';

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverviewResponse = {
  operator: {
    id: 1,
    name: 'Blue Current Diving · Aqaba',
    logoUrl: '/operator-logo.png',
    tier: 2,
  },
  metrics: {
    upcomingBookings7d: 12,
    divesToday: 3,
    uniqueDiversThisWeek: 18,
  },
  todaySchedule: {
    date: '2025-12-02',
    items: [
      {
        id: 'session-1',
        title: 'Morning Reef Dive – Japanese Garden',
        meetTime: '08:00',
        startTime: '09:00',
        siteName: 'Japanese Garden',
        rosterCount: 5,
        capacity: 10,
        status: 'scheduled',
      },
    ],
  },
};