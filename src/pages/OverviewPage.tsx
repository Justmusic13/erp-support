import React from 'react';
import { ERPConfig } from '../config/erpConfig';
import {
  CheckCircle2Icon,
  ServerIcon,
  ShieldCheckIcon,
  ZapIcon,
  SparklesIcon } from
'lucide-react';
import { ARIAChatPage } from './ARIAChatPage';
interface OverviewPageProps {
  erpConfig: ERPConfig;
  onNavigate: (section: string) => void;
}
export function OverviewPage({ erpConfig, onNavigate }: OverviewPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-8">
        <h1 className="text-3xl font-extrabold text-[#1A1F36] mb-4">
          {erpConfig.name} Integration Overview
        </h1>
        <p className="text-lg text-[#4B5563] max-w-3xl">
          {erpConfig.description} This overview covers the key capabilities,
          system requirements, and provides access to ARIA, your AI-powered
          integration assistant.
        </p>
      </div>

      {/* Key Features - Full Width */}
      <section>
        <h2 className="text-2xl font-bold text-[#1A1F36] mb-4 flex items-center">
          <ZapIcon className="h-6 w-6 mr-2 text-[#E8567F]" />
          Key Features
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {erpConfig.features.map((feature, idx) =>
            <li key={idx} className="flex items-start">
                <CheckCircle2Icon className="h-5 w-5 text-[#5C4EBF] mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-[#4B5563] font-medium">{feature}</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* ARIA Chat + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - ARIA Chat */}
        <div className="lg:col-span-2">
          <section>
            <h2 className="text-2xl font-bold text-[#1A1F36] mb-4 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-[#5C4EBF]" />
              Ask ARIA
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <ARIAChatPage erpConfig={erpConfig} embedded={true} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1A1F36] mb-4 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-[#9CA3AF]" />
              System Info
            </h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[#4B5563] font-medium">Current Version</dt>
                <dd className="text-[#1A1F36] font-bold mt-1">
                  {erpConfig.version}
                </dd>
              </div>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <dt className="text-[#4B5563] font-medium">
                  Supported Environments
                </dt>
                <dd className="text-[#1A1F36] font-semibold mt-1">
                  Production, Sandbox
                </dd>
              </div>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <dt className="text-[#4B5563] font-medium">Authentication</dt>
                <dd className="text-[#1A1F36] font-semibold mt-1">
                  API Key / OAuth 2.0
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-[#1A1F36] rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#5C4EBF] rounded-full opacity-20 blur-xl"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center relative z-10">
              <ServerIcon className="h-6 w-6 mr-2 text-[#5C4EBF]" />
              Resources
            </h3>
            <p className="text-white/80 text-sm mb-6 relative z-10">
              Access documentation, videos, and downloadable resources for{' '}
              {erpConfig.name}.
            </p>
            <button
              onClick={() => onNavigate('resources')}
              className="w-full bg-[#5C4EBF] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#5C4EBF]/90 transition-colors shadow-sm relative z-10">
              
              Browse Resources
            </button>
          </div>
        </div>
      </div>
    </div>);

}