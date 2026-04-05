import React, { useState } from 'react';
import { ERPConfig, ResourceItem } from '../config/erpConfig';
import {
  SaveIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  SettingsIcon,
  BotIcon,
  FileTextIcon,
  ServerIcon } from
'lucide-react';
interface IntegrationFormProps {
  initialData?: ERPConfig | null;
  onSubmit: (data: ERPConfig) => void;
  onCancel: () => void;
}
export function IntegrationForm({
  initialData,
  onSubmit,
  onCancel
}: IntegrationFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'aria' | 'resources'>(
    'basic'
  );
  const [formData, setFormData] = useState<ERPConfig>(
    initialData || {
      id: '',
      name: '',
      description: '',
      color: 'blue',
      version: '',
      features: [''],
      resources: [],
      agent: {
        name: '',
        welcomeMessage: '',
        suggestions: [''],
        copilotEndpoint: '',
        copilotAgentId: '',
        copilotEnvironmentId: ''
      }
    }
  );
  const handleBasicChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAgentChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        [name]: value
      }
    }));
  };
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures
    }));
  };
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  const handleSuggestionChange = (index: number, value: string) => {
    const newSuggestions = [...formData.agent.suggestions];
    newSuggestions[index] = value;
    setFormData((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        suggestions: newSuggestions
      }
    }));
  };
  const addSuggestion = () => {
    setFormData((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        suggestions: [...prev.agent.suggestions, '']
      }
    }));
  };
  const removeSuggestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        suggestions: prev.agent.suggestions.filter((_, i) => i !== index)
      }
    }));
  };
  const addResource = () => {
    const newResource: ResourceItem = {
      id: `res-${Date.now()}`,
      title: 'New Resource',
      description: '',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: new Date().toISOString().split('T')[0],
      content: ''
    };
    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
  };
  const updateResource = (
  index: number,
  field: keyof ResourceItem,
  value: any) =>
  {
    const newResources = [...formData.resources];
    newResources[index] = {
      ...newResources[index],
      [field]: value
    };
    setFormData((prev) => ({
      ...prev,
      resources: newResources
    }));
  };
  const removeResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up empty features/suggestions
    const cleanedData = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ''),
      agent: {
        ...formData.agent,
        suggestions: formData.agent.suggestions.filter((s) => s.trim() !== '')
      }
    };
    onSubmit(cleanedData);
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden animate-in fade-in duration-300">
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F5F7FA] gap-4">
        <h2 className="text-xl font-bold text-[#1A1F36]">
          {initialData ? 'Edit Integration' : 'Add New Integration'}
        </h2>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-4 py-2 text-[#4B5563] font-bold hover:bg-[#E5E7EB] rounded-lg transition-colors">
            
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#5C4EBF] text-white font-bold rounded-lg hover:bg-[#5C4EBF]/90 transition-colors flex items-center justify-center shadow-sm">
            
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>

      <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
        <button
          className={`px-6 py-3.5 font-bold text-sm flex items-center whitespace-nowrap transition-colors ${activeTab === 'basic' ? 'border-b-2 border-[#5C4EBF] text-[#5C4EBF] bg-white' : 'text-[#4B5563] hover:text-[#1A1F36] hover:bg-[#F5F7FA]'}`}
          onClick={() => setActiveTab('basic')}>
          
          <SettingsIcon className="h-4 w-4 mr-2" /> Basic Info
        </button>
        <button
          className={`px-6 py-3.5 font-bold text-sm flex items-center whitespace-nowrap transition-colors ${activeTab === 'aria' ? 'border-b-2 border-[#5C4EBF] text-[#5C4EBF] bg-white' : 'text-[#4B5563] hover:text-[#1A1F36] hover:bg-[#F5F7FA]'}`}
          onClick={() => setActiveTab('aria')}>
          
          <BotIcon className="h-4 w-4 mr-2" /> ARIA & Copilot
        </button>
        <button
          className={`px-6 py-3.5 font-bold text-sm flex items-center whitespace-nowrap transition-colors ${activeTab === 'resources' ? 'border-b-2 border-[#5C4EBF] text-[#5C4EBF] bg-white' : 'text-[#4B5563] hover:text-[#1A1F36] hover:bg-[#F5F7FA]'}`}
          onClick={() => setActiveTab('resources')}>
          
          <FileTextIcon className="h-4 w-4 mr-2" /> Resources (
          {formData.resources.length})
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'basic' &&
        <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                  Integration ID
                </label>
                <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleBasicChange}
                disabled={!!initialData}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none disabled:bg-[#F5F7FA] disabled:text-[#9CA3AF]"
                placeholder="e.g., netsuite" />
              
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Used for URLs and deep linking.
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                  Display Name
                </label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleBasicChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                placeholder="e.g., NetSuite ERP" />
              
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                Description
              </label>
              <textarea
              name="description"
              value={formData.description}
              onChange={handleBasicChange}
              rows={3}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none resize-none"
              placeholder="Brief description of the integration..." />
            
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                Current Version
              </label>
              <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleBasicChange}
              className="w-full max-w-xs px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
              placeholder="e.g., v2024.1.0" />
            
            </div>

            <div>
              <label className="block text-sm font-bold text-[#4B5563] mb-3">
                Key Features
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, idx) =>
              <div key={idx} className="flex items-center space-x-2">
                    <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                  placeholder="e.g., Bi-directional sync" />
                
                    <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="p-2 text-[#9CA3AF] hover:text-[#E8567F] hover:bg-[#E8567F]/10 rounded-lg transition-colors">
                  
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
              )}
                <button
                type="button"
                onClick={addFeature}
                className="text-sm font-bold text-[#5C4EBF] hover:text-[#5C4EBF]/80 flex items-center">
                
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Feature
                </button>
              </div>
            </div>
          </div>
        }

        {activeTab === 'aria' &&
        <div className="space-y-8 max-w-3xl">
            <div className="bg-[#F5F7FA] p-5 rounded-xl border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#1A1F36] mb-4 flex items-center">
                <ServerIcon className="h-5 w-5 mr-2 text-[#5C4EBF]" />
                Copilot Studio SDK Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                    Direct Line Token URL
                  </label>
                  <input
                  type="url"
                  name="copilotEndpoint"
                  value={formData.agent.copilotEndpoint || ''}
                  onChange={handleAgentChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                  placeholder="https://default.../directline/token?api-version=2022-03-01-preview" />
                
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    CoPilot Studio Direct Line token endpoint. Leave blank to use the site-wide default agent.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                      Agent ID
                    </label>
                    <input
                    type="text"
                    name="copilotAgentId"
                    value={formData.agent.copilotAgentId || ''}
                    onChange={handleAgentChange}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                    placeholder="e.g., agent_12345" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                      Environment ID
                    </label>
                    <input
                    type="text"
                    name="copilotEnvironmentId"
                    value={formData.agent.copilotEnvironmentId || ''}
                    onChange={handleAgentChange}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                    placeholder="e.g., env_67890" />
                  
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1A1F36] border-b border-[#E5E7EB] pb-2">
                Agent Persona
              </h3>
              <div>
                <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                  Agent Name
                </label>
                <input
                type="text"
                name="name"
                value={formData.agent.name}
                onChange={handleAgentChange}
                className="w-full max-w-md px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                placeholder="e.g., ARIA for NetSuite" />
              
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
                  Welcome Message
                </label>
                <textarea
                name="welcomeMessage"
                value={formData.agent.welcomeMessage}
                onChange={handleAgentChange}
                rows={3}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none resize-none"
                placeholder="Hello! I am ARIA..." />
              
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4B5563] mb-3">
                  Suggested Prompts
                </label>
                <div className="space-y-3">
                  {formData.agent.suggestions.map((suggestion, idx) =>
                <div key={idx} className="flex items-center space-x-2">
                      <input
                    type="text"
                    value={suggestion}
                    onChange={(e) =>
                    handleSuggestionChange(idx, e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none"
                    placeholder="e.g., How do I configure webhooks?" />
                  
                      <button
                    type="button"
                    onClick={() => removeSuggestion(idx)}
                    className="p-2 text-[#9CA3AF] hover:text-[#E8567F] hover:bg-[#E8567F]/10 rounded-lg transition-colors">
                    
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                )}
                  <button
                  type="button"
                  onClick={addSuggestion}
                  className="text-sm font-bold text-[#5C4EBF] hover:text-[#5C4EBF]/80 flex items-center">
                  
                    <PlusIcon className="h-4 w-4 mr-1" /> Add Suggestion
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        {activeTab === 'resources' &&
        <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-[#4B5563] font-medium">
                Manage documents, videos, and downloads for this integration.
              </p>
              <button
              type="button"
              onClick={addResource}
              className="flex items-center text-sm bg-[#F5F7FA] text-[#1A1F36] px-4 py-2 rounded-lg font-bold hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB]">
              
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Resource
              </button>
            </div>

            {formData.resources.length === 0 ?
          <div className="text-center py-12 bg-[#F5F7FA] rounded-xl border border-[#E5E7EB] border-dashed">
                <FileTextIcon className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
                <p className="text-[#4B5563] font-medium">
                  No resources added yet.
                </p>
              </div> :

          <div className="space-y-6">
                {formData.resources.map((resource, idx) =>
            <div
              key={resource.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 relative shadow-sm">
              
                    <button
                type="button"
                onClick={() => removeResource(idx)}
                className="absolute top-4 right-4 p-2 text-[#9CA3AF] hover:text-[#E8567F] hover:bg-[#E8567F]/10 rounded-lg transition-colors"
                title="Remove Resource">
                
                      <TrashIcon className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                          Title
                        </label>
                        <input
                    type="text"
                    value={resource.title}
                    onChange={(e) =>
                    updateResource(idx, 'title', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] outline-none" />
                  
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                          Type
                        </label>
                        <select
                    value={resource.type}
                    onChange={(e) =>
                    updateResource(idx, 'type', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] outline-none bg-white">
                    
                          <option value="guidance">Guidance</option>
                          <option value="document">Document</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                          Description
                        </label>
                        <input
                    type="text"
                    value={resource.description}
                    onChange={(e) =>
                    updateResource(idx, 'description', e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] outline-none" />
                  
                      </div>
                    </div>

                    {resource.type === 'video' &&
              <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                          Video Embed URL
                        </label>
                        <input
                  type="url"
                  value={resource.videoUrl || ''}
                  onChange={(e) =>
                  updateResource(idx, 'videoUrl', e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] outline-none"
                  placeholder="https://www.youtube.com/embed/..." />
                
                      </div>
              }
                    {resource.type === 'document' &&
              <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                          PDF Document URL
                        </label>
                        <input
                  type="url"
                  value={resource.pdfUrl || ''}
                  onChange={(e) =>
                  updateResource(idx, 'pdfUrl', e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] outline-none"
                  placeholder="https://example.com/document.pdf" />
                
                      </div>
              }
                    {resource.type === 'guidance' &&
              <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                          Text Content (Markdown/HTML supported)
                        </label>
                        <textarea
                  value={
                  typeof resource.content === 'string' ?
                  resource.content :
                  ''
                  }
                  onChange={(e) =>
                  updateResource(idx, 'content', e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] outline-none resize-y font-mono"
                  placeholder="Enter guidance content here..." />
                
                      </div>
              }
                  </div>
            )}
              </div>
          }
          </div>
        }
      </div>
    </div>);

}