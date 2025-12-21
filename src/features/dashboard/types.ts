export interface OperatorSummary {
  id: number;
  name: string;
  logoUrl: string | null;
  tier: number | null;
}

export interface DashboardMetrics {
  upcomingBookings7d: number;
  divesToday: number;
  uniqueDiversThisWeek: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  meetTime: string;
  startTime: string;
  siteName: string;
  rosterCount: number;
  capacity: number;
  status: 'scheduled' | 'boarding' | 'departed' | 'cancelled';
}

export interface DashboardTodaySchedule {
  date: string;
  items: ScheduleItem[];
}

export interface DashboardOverviewResponse {
  operator: OperatorSummary;
  metrics: DashboardMetrics;
  todaySchedule: DashboardTodaySchedule;
}