/*
 * File: EventModal.tsx
 * Path: src/components/calendar/EventModal.tsx
 * Description: Event detail modal for AQUORIX Base Calendar MVP. Shows event info and stub actions.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: MVP scaffold
 * Dependencies: React
 * Notes: Minimal, accessible modal. No real backend yet.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Initial MVP scaffold.
 */

import React from 'react';
import styles from './EventModal.module.css';
import { CalendarEvent } from './mockData';

interface EventModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  if (!event) return null;
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" tabIndex={-1}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        <h2>{event.title}</h2>
        <div><strong>Type:</strong> {event.type}</div>
        <div><strong>Status:</strong> {event.status}</div>
        <div><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</div>
        <div><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</div>
        <div><strong>Notes:</strong> {event.description || '—'}</div>
        <div><strong>Tags:</strong> {event.tags?.join(', ') || '—'}</div>
        <div style={{ marginTop: 16 }}>
          <button className={styles.actionBtn} disabled> Edit (stub) </button>
          <button className={styles.actionBtn} disabled> Delete (stub) </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
