/*
 * File: Calendar.tsx
 * Path: src/pages/admin/Calendar.tsx
 * Description: AQUORIX Admin Calendar page. Renders FullCalendar-based CalendarGrid with tier-aware and event integration scaffolding.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: In Progress (FullCalendar migration)
 * Dependencies: React, CalendarGrid, @fullcalendar/react, @fullcalendar/daygrid, @fullcalendar/timegrid, @fullcalendar/interaction
 * Notes: Migrated from MVP/RBC. Connects to CalendarGrid. Ready for Supabase event/user wiring.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: FullCalendar migration scaffold. Replaces RBC spike. See migration spec for details.
 */

import React from 'react';
import CalendarGrid from '../../components/calendar/CalendarGrid';

/**
 * AQUORIX Calendar Page (container)
 * - Renders CalendarGrid (FullCalendar logic)
 * - Future: Provide user/tier/event props from Supabase
 */
const Calendar: React.FC = () => {
  // TODO: Wire in Supabase user/tier context and events
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <CalendarGrid />
    </div>
  );
};

export default Calendar;
