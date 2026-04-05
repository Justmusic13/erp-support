import React, { useState, createContext, useContext } from 'react';
import { ERPConfig, erpConfigs as initialConfigs } from '../config/erpConfig';
interface ERPContextType {
  getERPConfig: (id: string | null) => ERPConfig | null;
  getAllERPs: () => ERPConfig[];
  addERPConfig: (config: ERPConfig) => void;
  updateERPConfig: (id: string, config: ERPConfig) => void;
  deleteERPConfig: (id: string) => void;
}
const ERPContext = createContext<ERPContextType | undefined>(undefined);
export function ERPProvider({ children }: {children: React.ReactNode;}) {
  const [configs, setConfigs] =
  useState<Record<string, ERPConfig>>(initialConfigs);
  const getERPConfig = (id: string | null) => {
    if (!id) return null;
    return configs[id] || null;
  };
  const getAllERPs = () => {
    return Object.values(configs);
  };
  const addERPConfig = (config: ERPConfig) => {
    setConfigs((prev) => ({
      ...prev,
      [config.id]: config
    }));
  };
  const updateERPConfig = (id: string, config: ERPConfig) => {
    setConfigs((prev) => ({
      ...prev,
      [id]: config
    }));
  };
  const deleteERPConfig = (id: string) => {
    setConfigs((prev) => {
      const newConfigs = {
        ...prev
      };
      delete newConfigs[id];
      return newConfigs;
    });
  };
  return (
    <ERPContext.Provider
      value={{
        getERPConfig,
        getAllERPs,
        addERPConfig,
        updateERPConfig,
        deleteERPConfig
      }}>
      
      {children}
    </ERPContext.Provider>);

}
export function useERPContext() {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error('useERPContext must be used within an ERPProvider');
  }
  return context;
}