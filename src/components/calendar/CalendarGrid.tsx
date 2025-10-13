/*
 * File: CalendarGrid.tsx
 * Path: src/components/calendar/CalendarGrid.tsx
 * Description: FullCalendar wrapper for AQUORIX Admin Dashboard. Renders tier-aware, interactive calendar with event mapping and plugin setup.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: In Progress (FullCalendar migration)
 * Dependencies: React, @fullcalendar/react, @fullcalendar/daygrid, @fullcalendar/timegrid, @fullcalendar/interaction
 * Notes: Uses mockEvents for now. Ready for Supabase integration. See Calendar.tsx for container.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Migrated CalendarGrid to FullCalendar wrapper. MVP grid logic removed.
 */

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { mockEvents } from './mockData';
// ===============================
// Section: FullCalendar CSS (v6+) is loaded via CDN in public/index.html
// See FullCalendar React docs for details. No direct CSS imports here.


// ===============================
// Section: Event Data Mapping
// ===============================
const fcEvents = mockEvents.map(ev => ({
  id: ev.id,
  title: ev.title,
  start: ev.start_time,
  end: ev.end_time,
  color: (() => {
    if (ev.type === 'dive') return '#1b4d6f';
    if (ev.type === 'course') return '#248dc1';
    if (ev.type === 'block') return '#4a5c6a';
    if (ev.type === 'internal') return '#00d4ff';
    if (ev.type === 'guest') return '#00bfae';
    return '#248dc1';
  })(),
  extendedProps: {
    resource: ev.resource_ids,
    type: ev.type,
    status: ev.status,
  },
}));

// ===============================
// Section: FullCalendar Wrapper Component
// ===============================
const CalendarGrid: React.FC = () => {
  // TODO: Replace mockEvents with Supabase events; add tier/user filtering
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
      <h2 style={{ color: '#1b4d6f', marginBottom: 18 }}>AQUORIX Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        events={fcEvents}
        eventClick={info => alert(`Event: ${info.event.title}`)}
        height={600}
        eventDisplay="block"
        dayMaxEvents={2}
      />
    </div>
  );
};

export default CalendarGrid;
