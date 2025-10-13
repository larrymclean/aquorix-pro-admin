/*
 * File: mockData.ts
 * Path: src/components/calendar/mockData.ts
 * Description: Mock data for AQUORIX Base Calendar MVP. Matches data dictionary structure.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: MVP scaffold
 * Dependencies: None
 * Notes: Used for local dev only. Replace with API/provider in future.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Initial MVP mock data.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'dive' | 'course' | 'block' | 'internal' | 'guest';
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  tags?: string[];
  resource_ids?: string[];
  created_by?: string;
  visibility_tiers?: number[];
  location_id?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
  created_at?: string;
  updated_at?: string;
}

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Open Water Course',
    type: 'course',
    start_time: '2025-07-09T09:00:00Z',
    end_time: '2025-07-09T12:00:00Z',
    status: 'confirmed',
    tags: ['reef', 'beginner'],
    description: 'SSI Open Water Course with Maya',
    resource_ids: ['r1'],
    visibility_tiers: [1,2,3,4],
  },
  {
    id: '2',
    title: 'Blocked: Maintenance',
    type: 'block',
    start_time: '2025-07-08T00:00:00Z',
    end_time: '2025-07-08T23:59:59Z',
    status: 'pending',
    tags: ['maintenance'],
    description: 'Coral Queen Boat annual check',
    resource_ids: ['r2'],
    visibility_tiers: [3,4],
  },
  {
    id: '3',
    title: 'Guest Booking: Smith Family',
    type: 'guest',
    start_time: '2025-07-21T08:00:00Z',
    end_time: '2025-07-21T11:00:00Z',
    status: 'confirmed',
    tags: ['family'],
    description: 'Private tour for Smith family',
    resource_ids: ['r1'],
    visibility_tiers: [2,3,4,5],
  },
];
