import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle }) => {
  return (
    <div className="aqx-card" style={{ padding: 16, marginBottom: 16 }}>
      <div
        style={{
          fontSize: 12,
          color: 'var(--aqx-slate-light)',
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--aqx-primary)',
          marginBottom: 2,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--aqx-slate-light)' }}>
        {subtitle}
      </div>
    </div>
  );
};