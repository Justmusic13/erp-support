import React from 'react';
import { useERPContext } from '../context/ERPContext';
import { ArrowRightIcon, DatabaseIcon, CloudIcon } from 'lucide-react';
interface LandingPageProps {
  onSelectERP: (erpId: string) => void;
}
export function LandingPage({ onSelectERP }: LandingPageProps) {
  const { getAllERPs } = useERPContext();
  const erps = getAllERPs();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1F36] tracking-tight mb-4">
          Partner Documentation Portal
        </h1>
        <p className="text-xl text-[#4B5563]">
          Select your ERP integration below to access tailored documentation,
          resources, and dedicated ARIA support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {erps.map((erp) =>
        <div
          key={erp.id}
          className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 hover:shadow-lg hover:border-[#5C4EBF] transition-all cursor-pointer group flex flex-col h-full"
          onClick={() => onSelectERP(erp.id)}>
          
            <div className="flex items-center mb-6">
              <div
              className={`h-14 w-14 rounded-xl flex items-center justify-center bg-[#5C4EBF] text-white mr-4 group-hover:scale-110 transition-transform`}>
              
                {erp.id === 'sage100' ?
              <DatabaseIcon className="h-7 w-7" /> :

              <CloudIcon className="h-7 w-7" />
              }
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A1F36]">
                  {erp.name}
                </h2>
                <span className="text-sm font-bold text-[#5C4EBF] bg-[#5C4EBF]/20 px-2.5 py-1 rounded-md mt-1 inline-block">
                  {erp.version}
                </span>
              </div>
            </div>

            <p className="text-[#4B5563] mb-8 flex-1 font-medium">
              {erp.description}
            </p>

            <button className="mt-auto w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-lg text-[#1A1F36] bg-[#F5F7FA] group-hover:bg-[#5C4EBF] group-hover:text-white transition-colors">
              View Integration
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-20 text-center text-[#9CA3AF] text-sm max-w-2xl font-medium">
        <p>
          Don't see your ERP listed? Contact your partner manager to request
          access to additional integration documentation.
        </p>
      </div>
    </div>);

}