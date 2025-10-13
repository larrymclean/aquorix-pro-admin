/*
 * File: NotAuthorized.tsx
 * Path: src/pages/NotAuthorized.tsx
 * Description: User-friendly page for unauthorized dashboard access attempts.
 * Author: AQUORIX Engineering
 * Created: 2025-07-11
 * Last Updated: 2025-07-11
 * Status: MVP
 * Dependencies: React
 * Notes: Displayed when a user tries to access a dashboard route they are not authorized for.
 * Change Log:
 *   2025-07-11 (AQUORIX Eng): Initial creation.
 */
import React from 'react';

const NotAuthorized: React.FC = () => (
  <div className="not-authorized-container" style={{ padding: 32, textAlign: 'center' }}>
    <h1>Not Authorized</h1>
    <p>You are not authorized to access this dashboard.<br />
      If you believe this is an error, please contact support.</p>
    <a href="/" className="auth-button" style={{ marginTop: 24 }}>Return Home</a>
  </div>
);

export default NotAuthorized;
