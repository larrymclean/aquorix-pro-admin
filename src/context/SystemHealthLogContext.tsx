/*
  File: SystemHealthLogContext.tsx
  Path: src/context/SystemHealthLogContext.tsx
  Description: React context/provider for capturing and displaying system health and debug logs across the AQUORIX Pro Admin dashboard. Enables any component to log structured messages for QA, debugging, and live diagnostics.
  Author: AQUORIX Engineering
  Created: 2025-07-12
  Last Updated: 2025-07-12
  Status: MVP, active
  Dependencies: React
  Notes: Use logSystemHealth(message, data) to write to the log from anywhere in the app.
  Change Log:
    - 2025-07-12 (AQUORIX Eng): Initial MVP context/provider for system health log.
*/

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SystemHealthLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}

interface SystemHealthLogContextType {
  log: SystemHealthLogEntry[];
  logSystemHealth: (message: string, data?: any, level?: 'info' | 'warn' | 'error') => void;
  clearLog: () => void;
}

const SystemHealthLogContext = createContext<SystemHealthLogContextType | undefined>(undefined);

export const useSystemHealthLog = () => {
  const ctx = useContext(SystemHealthLogContext);
  if (!ctx) throw new Error('useSystemHealthLog must be used within a SystemHealthLogProvider');
  return ctx;
};

export const SystemHealthLogProvider = ({ children }: { children: ReactNode }) => {
  const [log, setLog] = useState<SystemHealthLogEntry[]>([]);

  const logSystemHealth = (message: string, data?: any, level: 'info' | 'warn' | 'error' = 'info') => {
    setLog(prev => [
      {
        timestamp: new Date().toISOString(),
        level,
        message,
        data
      },
      ...prev
    ]);
  };

  const clearLog = () => setLog([]);

  return (
    <SystemHealthLogContext.Provider value={{ log, logSystemHealth, clearLog }}>
      {children}
    </SystemHealthLogContext.Provider>
  );
};
