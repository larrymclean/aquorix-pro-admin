// Minimal type declaration for react-big-calendar for spike purposes only
// AQUORIX: Do not use in production. Remove after spike.
declare module 'react-big-calendar' {
  import * as React from 'react';
  export interface CalendarProps {
    localizer: any;
    events: any[];
    startAccessor: string;
    endAccessor: string;
    style?: React.CSSProperties;
    views?: string[];
    popup?: boolean;
    selectable?: boolean;
    onSelectEvent?: (event: any) => void;
    eventPropGetter?: (event: any) => { style?: React.CSSProperties };
  }
  export class Calendar extends React.Component<CalendarProps> {}
  export function dateFnsLocalizer(config: any): any;
}
