/*
 * File: FilterBar.tsx
 * Path: src/components/calendar/FilterBar.tsx
 * Description: Stub filter/legend bar for AQUORIX Base Calendar MVP. UI only for now.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: MVP scaffold
 * Dependencies: React
 * Notes: Filtering logic to be implemented in later atomic change.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Initial MVP scaffold.
 */

import React from 'react';
import styles from './FilterBar.module.css';

const FilterBar: React.FC = () => (
  <div className={styles.filterBar}>
    <span className={styles.legendTitle}>Legend:</span>
    <span className={styles.legendItem + ' ' + styles.dive}>Dive Tour</span>
    <span className={styles.legendItem + ' ' + styles.course}>Course</span>
    <span className={styles.legendItem + ' ' + styles.block}>Blocked</span>
    <span className={styles.legendItem + ' ' + styles.internal}>Internal</span>
    <span className={styles.legendItem + ' ' + styles.guest}>Guest Booking</span>
    {/* Filter dropdowns (stub) */}
    <span className={styles.filterStub}>[Filter UI stub]</span>
  </div>
);

export default FilterBar;
