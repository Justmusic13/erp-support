import React from 'react';
export type ResourceItem = {
  id: string;
  title: string;
  description: string;
  type: 'guidance' | 'video' | 'document';
  content?: React.ReactNode;
  videoUrl?: string;
  pdfUrl?: string;
  downloadUrl?: string;
  downloadFileName?: string;
  fileSize?: string;
  lastUpdated?: string;
  icon?: 'pdf' | 'video' | 'guide' | 'template' | 'archive';
};
export type ERPConfig = {
  id: string;
  name: string;
  description: string;
  color: string;
  version: string;
  features: string[];
  resources: ResourceItem[];
  agent: {
    name: string;
    welcomeMessage: string;
    suggestions: string[];
    /** Direct Line token URL from CoPilot Studio. Populated = live agent, empty = demo mode fallback. */
    copilotEndpoint?: string;
    copilotAgentId?: string;
    copilotEnvironmentId?: string;
  };
};
export const erpConfigs: Record<string, ERPConfig> = {
  sage100: {
    id: 'sage100',
    name: 'Sage 100',
    description:
    'Complete integration documentation and resources for Sage 100 ERP.',
    color: 'blue',
    version: 'v2024.1.0',
    features: [
    'Bi-directional customer sync',
    'Real-time inventory valuation',
    'Automated sales order creation',
    'Custom field mapping support'],

    resources: [
    {
      id: 'installation',
      title: 'Installation Guide',
      description:
      'Step-by-step instructions for installing the Sage 100 connector',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-03-15',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Installing the Sage 100 Connector
            </h2>
            <p className="text-[#4B5563]">
              Follow these steps to install the connector on your Sage 100
              server. Ensure you have administrative privileges before
              beginning.
            </p>
            <h3 className="text-xl font-semibold text-[#1A1F36] mt-6">
              Prerequisites
            </h3>
            <ul className="list-disc pl-5 text-[#4B5563] space-y-2">
              <li>Sage 100 version 2021 or higher</li>
              <li>Windows Server 2016 or higher</li>
              <li>.NET Framework 4.8</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#1A1F36] mt-6">
              Step-by-Step Installation
            </h3>
            <ol className="list-decimal pl-5 text-[#4B5563] space-y-3">
              <li>
                Download the latest installer from the{' '}
                <strong>Resources</strong> section.
              </li>
              <li>
                Run{' '}
                <code className="bg-[#F5F7FA] px-1.5 py-0.5 rounded text-sm border border-[#E5E7EB] text-[#1A1F36]">
                  Sage100_Connector_Setup.exe
                </code>{' '}
                as Administrator.
              </li>
              <li>Follow the installation wizard prompts.</li>
              <li>
                When prompted for the API Key, paste the key generated from your
                Partner Portal.
              </li>
              <li>Restart the Sage 100 Application Server service.</li>
            </ol>
          </div>

    },
    {
      id: 'configuration',
      title: 'Configuration Guide',
      description: 'Configure connection settings and sync preferences',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-03-15',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Configuring the Integration
            </h2>
            <p className="text-[#4B5563]">
              Once installed, you need to configure the connection settings and
              sync preferences.
            </p>
            <div className="bg-[#5C4EBF]/10 border-l-4 border-[#5C4EBF] p-4 my-4">
              <p className="text-[#1A1F36] text-sm">
                <strong>Note:</strong> Configuration changes may take up to 5
                minutes to propagate across all active syncing nodes.
              </p>
            </div>
            <h3 className="text-xl font-semibold text-[#1A1F36] mt-6">
              Connection Settings
            </h3>
            <p className="text-[#4B5563]">
              Navigate to{' '}
              <strong>Library Master &gt; Setup &gt; Connector Settings</strong>{' '}
              in your Sage 100 environment.
            </p>
            <h3 className="text-xl font-semibold text-[#1A1F36] mt-6">
              Sync Intervals
            </h3>
            <p className="text-[#4B5563]">
              Define how often data should synchronize between systems.
              Recommended intervals:
            </p>
            <ul className="list-disc pl-5 text-[#4B5563] space-y-2">
              <li>Customer data: Every 15 minutes</li>
              <li>Inventory: Every 5 minutes</li>
              <li>Sales orders: Real-time</li>
            </ul>
          </div>

    },
    {
      id: 'mapping',
      title: 'Field Mapping Reference',
      description: 'Default field mappings between Sage 100 and the platform',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-03-10',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Field Mapping Reference
            </h2>
            <p className="text-[#4B5563]">
              Below is the default field mapping between Sage 100 and the
              platform.
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-lg">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Sage 100 Field
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Platform Field
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Direction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1F36]">
                      ARDivisionNo + CustomerNo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      customer_id
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      Bi-directional
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1F36]">
                      CustomerName
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      company_name
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                      Sage &rarr; Platform
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions for Sage 100 integration',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-03-12',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Common Issues & Solutions
            </h2>
            <h3 className="text-lg font-semibold text-[#1A1F36] mt-4">
              Error: "Invalid API Key"
            </h3>
            <p className="text-[#4B5563]">
              Ensure the API key in the Connector Settings matches the one in
              your Partner Portal. Check for leading or trailing spaces.
            </p>
            <h3 className="text-lg font-semibold text-[#1A1F36] mt-4">
              Sync is stuck or delayed
            </h3>
            <p className="text-[#4B5563]">
              Restart the Connector Windows Service. If the issue persists,
              check the{' '}
              <code className="bg-[#F5F7FA] px-1.5 py-0.5 rounded text-sm border border-[#E5E7EB] text-[#1A1F36]">
                sync_error.log
              </code>{' '}
              file in the installation directory.
            </p>
            <h3 className="text-lg font-semibold text-[#1A1F36] mt-4">
              Data not appearing in platform
            </h3>
            <p className="text-[#4B5563]">
              Verify that the sync service is running and check the field
              mappings are correct. Use the Test Connection button in Connector
              Settings to diagnose connectivity issues.
            </p>
          </div>

    },
    {
      id: 'release-notes',
      title: 'Release Notes',
      description: 'Latest updates and version history',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-03-15',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">Release Notes</h2>
            <div className="border-l-2 border-[#E5E7EB] pl-4 py-2">
              <h3 className="text-lg font-semibold text-[#1A1F36]">
                Version 2024.1.0{' '}
                <span className="text-sm font-normal text-[#9CA3AF] ml-2">
                  March 15, 2024
                </span>
              </h3>
              <ul className="list-disc pl-5 text-[#4B5563] mt-2 space-y-1">
                <li>Added support for multi-warehouse inventory sync.</li>
                <li>
                  Fixed an issue where long customer names were truncated.
                </li>
                <li>
                  Performance improvements for initial historical data load.
                </li>
              </ul>
            </div>
          </div>

    },
    {
      id: 'getting-started-video',
      title: 'Getting Started Video Walkthrough',
      description:
      'Complete video tutorial for setting up your Sage 100 integration',
      type: 'video',
      icon: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lastUpdated: '2024-03-01'
    },
    {
      id: 'field-mapping-video',
      title: 'Field Mapping Tutorial',
      description: 'Learn how to configure custom field mappings',
      type: 'video',
      icon: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lastUpdated: '2024-02-28'
    },
    {
      id: 'integration-manual-pdf',
      title: 'Integration Manual (PDF)',
      description: 'Complete integration manual with detailed instructions',
      type: 'guidance',
      icon: 'pdf',
      downloadUrl: '#',
      downloadFileName: 'Sage100_Integration_Manual_v2024.pdf',
      fileSize: '3.4 MB',
      lastUpdated: '2024-03-16',
      content:
      <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-red-50 rounded-lg flex items-center justify-center mr-4">
                  <svg
                className="h-8 w-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20">
                
                    <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd" />
                
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1F36]">
                    Sage100_Integration_Manual_v2024.pdf
                  </h3>
                  <p className="text-sm text-[#4B5563] mt-1">
                    3.4 MB • Last updated March 16, 2024
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1A1F36]">
                  Document Contents:
                </h4>
                <ul className="list-disc pl-5 text-[#4B5563] space-y-2">
                  <li>Complete installation instructions with screenshots</li>
                  <li>Configuration and setup procedures</li>
                  <li>Field mapping reference tables</li>
                  <li>Troubleshooting guide and FAQ</li>
                  <li>API reference documentation</li>
                  <li>Best practices and optimization tips</li>
                </ul>
                <p className="text-sm text-[#4B5563] mt-4">
                  This comprehensive manual covers all aspects of the Sage 100
                  integration. Download the PDF for offline reference and
                  detailed technical specifications.
                </p>
              </div>
            </div>
          </div>

    },
    {
      id: 'architecture-whitepaper',
      title: 'Architecture & Security Whitepaper (PDF)',
      description: 'Technical architecture and security overview',
      type: 'guidance',
      icon: 'pdf',
      downloadUrl: '#',
      downloadFileName: 'Architecture_Security_Whitepaper.pdf',
      fileSize: '1.2 MB',
      lastUpdated: '2023-12-01',
      content:
      <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-red-50 rounded-lg flex items-center justify-center mr-4">
                  <svg
                className="h-8 w-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20">
                
                    <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd" />
                
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1F36]">
                    Architecture_Security_Whitepaper.pdf
                  </h3>
                  <p className="text-sm text-[#4B5563] mt-1">
                    1.2 MB • Last updated December 1, 2023
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1A1F36]">
                  Document Contents:
                </h4>
                <ul className="list-disc pl-5 text-[#4B5563] space-y-2">
                  <li>System architecture overview and data flow diagrams</li>
                  <li>Security protocols and encryption standards</li>
                  <li>Authentication and authorization mechanisms</li>
                  <li>Compliance certifications (SOC 2, GDPR)</li>
                  <li>Network topology and firewall requirements</li>
                  <li>Disaster recovery and backup procedures</li>
                </ul>
                <p className="text-sm text-[#4B5563] mt-4">
                  This whitepaper provides detailed technical information about
                  the integration architecture and security measures for
                  enterprise compliance reviews.
                </p>
              </div>
            </div>
          </div>

    }],

    agent: {
      name: 'ARIA for Sage 100',
      welcomeMessage:
      'Hi! I am ARIA, your Sage 100 integration assistant. I can help you with installation, mapping fields like ARDivisionNo, or troubleshooting sync errors. What do you need help with today?',
      suggestions: [
      'How do I install the connector?',
      'Troubleshoot "Invalid API Key" error',
      'How is CustomerName mapped?'],
      // Default CoPilot Studio Direct Line token URL (configurable per-ERP in Admin)
      copilotEndpoint:
      'https://defaultf20e09a3a5b549d2bc3e54a56af886.75.environment.api.powerplatform.com/powervirtualagents/botsbyschema/copilots_header_a6902/directline/token?api-version=2022-03-01-preview'
    }
  },
  acumatica: {
    id: 'acumatica',
    name: 'Acumatica',
    description:
    'Cloud ERP integration guides, endpoints, and resources for Acumatica.',
    color: 'blue',
    version: 'v2024 R1',
    features: [
    'OData and REST API support',
    'Real-time webhook synchronization',
    'Multi-tenant configuration',
    'Advanced generic inquiry mapping'],

    resources: [
    {
      id: 'installation',
      title: 'Installation Guide',
      description: 'Deploy the Acumatica customization package',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-02-28',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Deploying the Acumatica Customization Package
            </h2>
            <p className="text-[#4B5563]">
              Our Acumatica integration relies on a certified Customization
              Project. Follow these steps to publish it.
            </p>
            <ol className="list-decimal pl-5 text-[#4B5563] space-y-3 mt-4">
              <li>
                Download the latest{' '}
                <code className="bg-[#F5F7FA] px-1.5 py-0.5 rounded text-sm border border-[#E5E7EB] text-[#1A1F36]">
                  .zip
                </code>{' '}
                package from the Resources section.
              </li>
              <li>Log into your Acumatica instance as an Administrator.</li>
              <li>
                Navigate to{' '}
                <strong>Customization &gt; Customization Projects</strong>.
              </li>
              <li>
                Click <strong>Import</strong> and select the downloaded zip
                file.
              </li>
              <li>
                Select the imported project and click <strong>Publish</strong>.
              </li>
            </ol>
          </div>

    },
    {
      id: 'configuration',
      title: 'Configuration Guide',
      description: 'Set up webhooks and real-time synchronization',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-02-28',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Setting up Webhooks
            </h2>
            <p className="text-[#4B5563]">
              To enable real-time sync, configure webhooks in the newly added
              Integration Preferences screen.
            </p>
            <h3 className="text-xl font-semibold text-[#1A1F36] mt-6">
              Enable Webhooks
            </h3>
            <ol className="list-decimal pl-5 text-[#4B5563] space-y-3 mt-4">
              <li>
                Navigate to Integration Preferences in your Acumatica instance
              </li>
              <li>Toggle the real-time sync option to enabled</li>
              <li>
                Enter the platform webhook listener URL provided in your Partner
                Portal
              </li>
              <li>Save changes to activate the webhooks</li>
            </ol>
          </div>

    },
    {
      id: 'mapping',
      title: 'Field Mapping & Endpoints',
      description: 'Endpoint configuration and field mapping guide',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-02-25',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Endpoint Mapping
            </h2>
            <p className="text-[#4B5563]">
              We utilize the default Default/22.200.001 endpoint for standard
              entities.
            </p>
            <h3 className="text-xl font-semibold text-[#1A1F36] mt-6">
              Supported Entities
            </h3>
            <ul className="list-disc pl-5 text-[#4B5563] space-y-2">
              <li>Customer - Default/22.200.001/Customer</li>
              <li>SalesOrder - Default/22.200.001/SalesOrder</li>
              <li>StockItem - Default/22.200.001/StockItem</li>
            </ul>
          </div>

    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions for Acumatica',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-02-20',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">
              Troubleshooting Acumatica
            </h2>
            <p className="text-[#4B5563]">
              If webhooks are failing, check the System Monitor &gt; Sync
              History screen for detailed HTTP response codes.
            </p>
            <h3 className="text-lg font-semibold text-[#1A1F36] mt-4">
              401 Unauthorized Errors
            </h3>
            <p className="text-[#4B5563]">
              Verify that the API user has the correct roles assigned and that
              the OAuth token has not expired.
            </p>
          </div>

    },
    {
      id: 'release-notes',
      title: 'Release Notes',
      description: 'Version history and updates',
      type: 'guidance',
      icon: 'guide',
      lastUpdated: '2024-02-28',
      content:
      <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1A1F36]">Release Notes</h2>
            <div className="border-l-2 border-[#E5E7EB] pl-4 py-2">
              <h3 className="text-lg font-semibold text-[#1A1F36]">
                Version 2024 R1{' '}
                <span className="text-sm font-normal text-[#9CA3AF] ml-2">
                  February 28, 2024
                </span>
              </h3>
              <p className="text-[#4B5563] mt-2">
                Version 2024 R1 includes support for the new Acumatica UI and
                updated REST API endpoints.
              </p>
            </div>
          </div>

    },
    {
      id: 'setup-video',
      title: 'Acumatica Setup Walkthrough',
      description:
      'Complete video guide for deploying the customization package',
      type: 'video',
      icon: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'webhook-video',
      title: 'Webhook Configuration Tutorial',
      description: 'Learn how to configure real-time webhooks',
      type: 'video',
      icon: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lastUpdated: '2024-02-10'
    },
    {
      id: 'setup-guide-pdf',
      title: 'Acumatica Setup Guide (PDF)',
      description: 'Comprehensive setup and configuration guide',
      type: 'guidance',
      icon: 'pdf',
      downloadUrl: '#',
      downloadFileName: 'Acumatica_Setup_Guide.pdf',
      fileSize: '4.5 MB',
      lastUpdated: '2024-03-01',
      content:
      <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-red-50 rounded-lg flex items-center justify-center mr-4">
                  <svg
                className="h-8 w-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20">
                
                    <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd" />
                
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1F36]">
                    Acumatica_Setup_Guide.pdf
                  </h3>
                  <p className="text-sm text-[#4B5563] mt-1">
                    4.5 MB • Last updated March 1, 2024
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1A1F36]">
                  Document Contents:
                </h4>
                <ul className="list-disc pl-5 text-[#4B5563] space-y-2">
                  <li>Customization package deployment instructions</li>
                  <li>Webhook configuration and testing</li>
                  <li>REST API endpoint reference</li>
                  <li>Generic inquiry setup guide</li>
                  <li>Multi-tenant configuration</li>
                  <li>Troubleshooting and support resources</li>
                </ul>
                <p className="text-sm text-[#4B5563] mt-4">
                  Complete guide for deploying and configuring the Acumatica
                  integration with detailed screenshots and examples.
                </p>
              </div>
            </div>
          </div>

    }],

    agent: {
      name: 'ARIA for Acumatica',
      welcomeMessage:
      'Hello! I am ARIA, configured specifically for your Acumatica integration. I can help with Customization Projects, Webhooks, or REST API endpoints. How can I assist you?',
      suggestions: [
      'How do I publish the customization package?',
      'Configure real-time webhooks',
      'Troubleshoot 401 Unauthorized errors'],
      // Default CoPilot Studio Direct Line token URL (configurable per-ERP in Admin)
      copilotEndpoint:
      'https://defaultf20e09a3a5b549d2bc3e54a56af886.75.environment.api.powerplatform.com/powervirtualagents/botsbyschema/copilots_header_a6902/directline/token?api-version=2022-03-01-preview'
    }
  }
};
export const getERPConfig = (id: string | null): ERPConfig | null => {
  if (!id) return null;
  return erpConfigs[id] || null;
};
export const getAllERPs = (): ERPConfig[] => {
  return Object.values(erpConfigs);
};