import React, { useState } from 'react';
import {
  BookOpenIcon,
  LibraryIcon,
  MenuIcon,
  XIcon,
  LayoutGridIcon } from
'lucide-react';
import { ERPConfig } from '../config/erpConfig';
interface NavigationProps {
  erpConfig: ERPConfig | null;
  currentSection: string;
  onNavigate: (section: string) => void;
  onNavigateHome: () => void;
}
export function Navigation({
  erpConfig,
  currentSection,
  onNavigate,
  onNavigateHome
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BookOpenIcon
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: LibraryIcon
  }];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };
  return (
    <nav className="bg-[#1A1F36] border-b border-[#1A1F36] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center cursor-pointer"
            onClick={onNavigateHome}>
            
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-[#5C4EBF] rounded-lg flex items-center justify-center mr-3">
                <LayoutGridIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Partner<span className="text-[#5C4EBF]">Docs</span>
              </span>
            </div>
            {erpConfig &&
            <div className="hidden sm:flex items-center ml-4 pl-4 border-l border-white/20">
                <span className="text-sm font-bold text-white bg-[#5C4EBF] px-3 py-1 rounded-full">
                  {erpConfig.name}
                </span>
              </div>
            }
          </div>

          {/* Desktop Navigation */}
          {erpConfig &&
          <div className="hidden md:flex md:items-center md:space-x-2">
              {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-[#5C4EBF] text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                  aria-current={isActive ? 'page' : undefined}>
                  
                    <Icon
                    className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-white/50'}`} />
                  
                    {item.label}
                  </button>);

            })}
            </div>
          }

          {/* Mobile menu button */}
          {erpConfig &&
          <div className="flex items-center md:hidden">
              <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#5C4EBF]"
              aria-expanded={mobileMenuOpen}>
              
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ?
              <XIcon className="block h-6 w-6" aria-hidden="true" /> :

              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              }
              </button>
            </div>
          }
        </div>
      </div>

      {/* Mobile Navigation */}
      {erpConfig && mobileMenuOpen &&
      <div className="md:hidden border-t border-white/10 bg-[#1A1F36]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center w-full px-3 py-3 rounded-md text-base font-semibold ${isActive ? 'bg-[#5C4EBF] text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                
                  <Icon
                  className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-white/50'}`} />
                
                  {item.label}
                </button>);

          })}
          </div>
        </div>
      }
    </nav>);

}