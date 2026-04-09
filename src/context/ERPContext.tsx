import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { ERPConfig, erpConfigs as staticConfigs } from '../config/erpConfig';

// API base URL — set VITE_API_URL in Render environment variables
// Falls back to /api for local dev (proxied by vite)
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const API_SECRET = import.meta.env.VITE_API_SECRET || '';

function apiHeaders(write = false) {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (write && API_SECRET) h['x-api-key'] = API_SECRET;
  return h;
}

// Strip non-serializable JSX from a config before sending to API
function sanitizeForDB(config: ERPConfig): ERPConfig {
  return {
    ...config,
    resources: config.resources.map(r => ({
      ...r,
      // Convert JSX content to empty string — admin will manage content as text
      content: typeof r.content === 'string' ? r.content : ''
    }))
  };
}

interface ERPContextType {
  getERPConfig: (id: string | null) => ERPConfig | null;
  getAllERPs: () => ERPConfig[];
  addERPConfig: (config: ERPConfig) => Promise<void>;
  updateERPConfig: (id: string, config: ERPConfig) => Promise<void>;
  deleteERPConfig: (id: string) => Promise<void>;
  isLoading: boolean;
  apiError: string | null;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export function ERPProvider({ children }: { children: React.ReactNode }) {
  // Start with static configs as the baseline
  const [configs, setConfigs] = useState<Record<string, ERPConfig>>(staticConfigs);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch DB configs on mount and merge over static defaults
  const fetchConfigs = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/erps`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const dbConfigs: ERPConfig[] = await res.json();
      if (dbConfigs.length > 0) {
        // DB records override static defaults by ID
        const merged = { ...staticConfigs };
        dbConfigs.forEach(c => { merged[c.id] = c; });
        setConfigs(merged);
      }
      // If DB is empty, static configs stay as-is
    } catch (err) {
      console.warn('API unavailable, using static config:', err);
      setApiError('Using offline data — changes will not be saved until the API is reachable.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const getERPConfig = (id: string | null) => {
    if (!id) return null;
    return configs[id] || null;
  };

  const getAllERPs = () => Object.values(configs);

  const addERPConfig = async (config: ERPConfig) => {
    // Optimistic update
    setConfigs(prev => ({ ...prev, [config.id]: config }));
    try {
      const res = await fetch(`${API_BASE}/erps`, {
        method: 'POST',
        headers: apiHeaders(true),
        body: JSON.stringify(sanitizeForDB(config))
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
    } catch (err) {
      console.error('Failed to save new ERP:', err);
      // Revert on failure
      setConfigs(prev => {
        const next = { ...prev };
        delete next[config.id];
        return next;
      });
      throw err;
    }
  };

  const updateERPConfig = async (id: string, config: ERPConfig) => {
    const previous = configs[id];
    // Optimistic update
    setConfigs(prev => ({ ...prev, [id]: config }));
    try {
      const res = await fetch(`${API_BASE}/erps/${id}`, {
        method: 'PUT',
        headers: apiHeaders(true),
        body: JSON.stringify(sanitizeForDB(config))
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
    } catch (err) {
      console.error('Failed to update ERP:', err);
      // Revert on failure
      if (previous) setConfigs(prev => ({ ...prev, [id]: previous }));
      throw err;
    }
  };

  const deleteERPConfig = async (id: string) => {
    const previous = configs[id];
    // Optimistic update
    setConfigs(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    try {
      const res = await fetch(`${API_BASE}/erps/${id}`, {
        method: 'DELETE',
        headers: apiHeaders(true)
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
    } catch (err) {
      console.error('Failed to delete ERP:', err);
      // Revert on failure
      if (previous) setConfigs(prev => ({ ...prev, [id]: previous }));
      throw err;
    }
  };

  return (
    <ERPContext.Provider value={{
      getERPConfig,
      getAllERPs,
      addERPConfig,
      updateERPConfig,
      deleteERPConfig,
      isLoading,
      apiError
    }}>
      {children}
    </ERPContext.Provider>
  );
}

export function useERPContext() {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error('useERPContext must be used within an ERPProvider');
  }
  return context;
}
