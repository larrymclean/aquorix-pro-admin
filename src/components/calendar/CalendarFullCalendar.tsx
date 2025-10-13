/*
 * File: CalendarFullCalendar.tsx
 * Path: src/components/calendar/CalendarFullCalendar.tsx
 * Description: Spike prototype for FullCalendar (React) in AQUORIX dashboard. For evaluation only.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: Spike
 * Dependencies: @fullcalendar/react, @fullcalendar/daygrid, @fullcalendar/timegrid, React
 * Notes: Uses local mockData. No production code. See /docs/calendar-spike-fullcalendar-setup.md.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Initial spike scaffold for FullCalendar.
 */

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
// FullCalendar CSS loaded via CDN in public/index.html for spike/prototype only.
// No local CSS imports needed here.
import { mockEvents } from './mockData';

// Adapt AQUORIX mock events to FullCalendar format
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

const CalendarFullCalendar: React.FC = () => (
  <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
    <h2 style={{ color: '#1b4d6f', marginBottom: 18 }}>FullCalendar Spike</h2>
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
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

export default CalendarFullCalendar;
