# AQUORIX Calendar Spike – FullCalendar React

## 1. Branch
- Branch: `spike/calendar-fullcalendar`

## 2. Install Dependencies

```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
```

## 3. Setup Import (in new CalendarFullCalendar.tsx)

```tsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
```

## 4. Usage Notes
- Use the existing `mockData.ts` for events (adapt to FullCalendar format if needed).
- Render FullCalendar inside `AQXAdminLayout` for dashboard context.
- Style with CSS Modules for AQUORIX brand alignment.
- Enable Month, Week, and TimeGrid views.
- Add placeholder modal or tooltip on event click.
- Test recurring events, drag-and-drop, accessibility.

## 5. Deliverables
- Working calendar in dashboard layout
- Code and notes on setup, integration, and customization
- Screenshots/demo for comparison

---

**AQUORIX header blocks and code comments required for all new files.**
