/*
 * File: CalendarRBC.tsx
 * Path: src/components/calendar/CalendarRBC.tsx
 * Description: Spike prototype for React Big Calendar (RBC) in AQUORIX dashboard. For evaluation only.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: Spike
 * Dependencies: react-big-calendar, date-fns, React
 * Notes: Uses local mockData. No production code. See /docs/calendar-spike-rbc-setup.md.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Initial spike scaffold for RBC.
 */

import React from 'react';
import { Calendar as RBCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { mockEvents } from './mockData';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Adapt AQUORIX mock events to RBC format
const rbcEvents = mockEvents.map(ev => ({
  id: ev.id,
  title: ev.title,
  start: new Date(ev.start_time),
  end: new Date(ev.end_time),
  allDay: false,
  resource: ev.resource_ids,
  type: ev.type,
  status: ev.status,
}));

// ===============================
// AQUORIX Spike: Use defaultView/defaultDate for navigation (RBC v1.x)
// ===============================

const CalendarRBC: React.FC = () => {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
      <h2 style={{ color: '#1b4d6f', marginBottom: 18 }}>React Big Calendar Spike <span style={{fontSize:12, color:'#248dc1'}}>(Navigation Test)</span></h2>
      <RBCalendar
        localizer={localizer}
        events={rbcEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        popup
        selectable
        onSelectEvent={event => alert(`Event: ${event.title}`)}
        eventPropGetter={event => {
          // Color-code by type
          let bg = '#248dc1';
          if (event.type === 'dive') bg = '#1b4d6f';
          if (event.type === 'course') bg = '#248dc1';
          if (event.type === 'block') bg = '#4a5c6a';
          if (event.type === 'internal') bg = '#00d4ff';
          if (event.type === 'guest') bg = '#00bfae';
          return { style: { backgroundColor: bg, borderRadius: 6, color: '#fff', border: 0 } };
        }}
      />
    </div>
  );
};

export default CalendarRBC;
