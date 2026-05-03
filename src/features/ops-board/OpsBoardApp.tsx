/*
 File: OpsBoardApp.tsx
 Path: src/features/ops-board/OpsBoardApp.tsx
 Description: Standalone AQUORIX Ops Board kiosk surface.
 Author: Larry McLean + ChatGPT
 Created: 2026-05-03
 Version: 0.1.0
 Status: P10.7-C1 placeholder route shell
*/

import React from 'react';
import './styles/opsBoard.css';

function OpsBoardApp() {
  return (
    <main className="aqx-ops-board">
      <section className="aqx-ops-board__placeholder">
        <div className="aqx-ops-board__eyebrow">AQUORIX OPS BOARD</div>
        <h1>Digital Dive Shop Whiteboard</h1>
        <p>P10.7-C1 route shell is live.</p>
        <p className="aqx-ops-board__status">Next: fixture-based React whiteboard.</p>
      </section>
    </main>
  );
}

export default OpsBoardApp;