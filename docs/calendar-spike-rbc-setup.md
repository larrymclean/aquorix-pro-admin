# AQUORIX Calendar Spike – React Big Calendar (RBC)

## 1. Branch
- Branch: `spike/calendar-rbc`

## 2. Install Dependencies

```bash
npm install react-big-calendar date-fns
```

## 3. Setup Localizer (in new CalendarRBC.tsx)

```tsx
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
```

## 4. Usage Notes
- Use the existing `mockData.ts` for events (adapt to RBC format if needed).
- Render `react-big-calendar` inside `AQXAdminLayout` for dashboard context.
- Style with CSS Modules (preferred) for AQUORIX brand alignment.
- Enable Month, Week, and Day views.
- Add placeholder modal or tooltip on event click.
- Test drag-and-drop, mobile responsiveness.

## 5. Deliverables
- Working calendar in dashboard layout
- Code and notes on setup, integration, and customization
- Screenshots/demo for comparison

---

**AQUORIX header blocks and code comments required for all new files.**
