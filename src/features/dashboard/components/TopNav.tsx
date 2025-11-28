import React from 'react';

interface TopNavProps {
  operatorName: string;
}

export const TopNav: React.FC<TopNavProps> = ({ operatorName }) => {
  return (
    <header className="aqx-topnav">
      <div>
        <div style={{ fontSize: 12, color: 'var(--aqx-slate-light)' }}>Operator</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{operatorName}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="aqx-btn-secondary">Alerts</button>
        <button className="aqx-btn-primary">Profile</button>
      </div>
    </header>
  );
};