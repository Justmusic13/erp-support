import React, { useState } from 'react';
import { useERPContext } from '../context/ERPContext';
import { ERPConfig } from '../config/erpConfig';
import { IntegrationForm } from '../components/IntegrationForm';
import {
  PlusIcon,
  Edit2Icon,
  Trash2Icon,
  ServerIcon,
  BotIcon } from
'lucide-react';
export function AdminPage() {
  const { getAllERPs, deleteERPConfig, addERPConfig, updateERPConfig } =
  useERPContext();
  const erps = getAllERPs();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const handleSave = (config: ERPConfig) => {
    if (isAdding) {
      addERPConfig(config);
    } else {
      updateERPConfig(config.id, config);
    }
    setIsAdding(false);
    setEditingId(null);
  };
  if (isAdding || editingId) {
    const initialData = editingId ? erps.find((e) => e.id === editingId) : null;
    return (
      <IntegrationForm
        initialData={initialData}
        onSubmit={handleSave}
        onCancel={() => {
          setIsAdding(false);
          setEditingId(null);
        }} />);


  }
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E5E7EB] pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1F36]">
            Admin Dashboard
          </h1>
          <p className="text-[#4B5563] mt-2 font-medium">
            Manage your ERP integrations, resources, and ARIA Copilot settings.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center bg-[#5C4EBF] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#5C4EBF]/90 transition-colors shadow-sm">
          
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {erps.map((erp) =>
        <div
          key={erp.id}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col hover:border-[#5C4EBF] transition-colors">
          
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1A1F36]">{erp.name}</h3>
                <span className="text-xs font-bold text-[#5C4EBF] bg-[#5C4EBF]/10 px-2 py-1 rounded mt-1.5 inline-block">
                  ID: {erp.id}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                onClick={() => setEditingId(erp.id)}
                className="p-2 text-[#4B5563] hover:text-[#5C4EBF] hover:bg-[#5C4EBF]/10 rounded-lg transition-colors"
                title="Edit Integration">
                
                  <Edit2Icon className="h-4 w-4" />
                </button>
                <button
                onClick={() => {
                  if (
                  window.confirm(
                    `Are you sure you want to delete ${erp.name}?`
                  ))
                  {
                    deleteERPConfig(erp.id);
                  }
                }}
                className="p-2 text-[#4B5563] hover:text-[#E8567F] hover:bg-[#E8567F]/10 rounded-lg transition-colors"
                title="Delete Integration">
                
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-[#4B5563] mb-6 flex-1 line-clamp-2 font-medium">
              {erp.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center text-sm">
                <ServerIcon className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                <span className="text-[#1A1F36] font-bold">
                  Version: {erp.version}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <BotIcon
                className={`h-4 w-4 mr-2 ${erp.agent.copilotEndpoint ? 'text-[#5C4EBF]' : 'text-[#9CA3AF]'}`} />
              
                <span
                className={
                erp.agent.copilotEndpoint ?
                'text-[#5C4EBF] font-bold' :
                'text-[#4B5563] font-medium'
                }>
                
                  {erp.agent.copilotEndpoint ?
                'Copilot Connected' :
                'Demo Agent'}
                </span>
              </div>
            </div>
          </div>
        )}
        {erps.length === 0 &&
        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-[#E5E7EB] border-dashed">
            <p className="text-[#4B5563] font-medium">
              No integrations found. Add one to get started.
            </p>
          </div>
        }
      </div>
    </div>);

}