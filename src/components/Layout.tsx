import React from 'react';
import { Navigation } from './Navigation';
import { FeedbackWidget } from './FeedbackWidget';
import { ERPConfig } from '../config/erpConfig';
interface LayoutProps {
  children: React.ReactNode;
  erpConfig: ERPConfig | null;
  currentSection: string;
  onNavigate: (section: string) => void;
  onNavigateHome: () => void;
  onAdminClick?: () => void;
}
export function Layout({
  children,
  erpConfig,
  currentSection,
  onNavigate,
  onNavigateHome,
  onAdminClick
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-[#1A1F36]">
      <Navigation
        erpConfig={erpConfig}
        currentSection={currentSection}
        onNavigate={onNavigate}
        onNavigateHome={onNavigateHome} />
      

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-[#E5E7EB] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#4B5563]">
            &copy; {new Date().getFullYear()} Partner Documentation Portal. All
            rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-[#4B5563]">
            <a
              href="#"
              className="hover:text-[#5C4EBF] transition-colors font-medium">
              
              Terms
            </a>
            <a
              href="#"
              className="hover:text-[#5C4EBF] transition-colors font-medium">
              
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-[#5C4EBF] transition-colors font-medium">
              
              Support
            </a>
            {onAdminClick &&
            <button
              onClick={onAdminClick}
              className="hover:text-[#5C4EBF] transition-colors font-medium focus:outline-none">
              
                Admin Sign-in
              </button>
            }
          </div>
        </div>
      </footer>

      <FeedbackWidget erpId={erpConfig?.id || null} />
    </div>);

}