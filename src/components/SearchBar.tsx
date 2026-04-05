import React, { useEffect, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}
export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  className = ''
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  return (
    <div className={`relative flex items-center ${className}`}>
      <SearchIcon
        className="absolute left-3 h-5 w-5 text-[#9CA3AF]"
        aria-hidden="true" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent text-sm text-[#1A1F36] placeholder-[#9CA3AF] bg-[#F5F7FA] focus:bg-white transition-colors"
        aria-label="Search" />
      
      {query &&
      <button
        onClick={handleClear}
        className="absolute right-3 p-1 rounded-full hover:bg-[#E5E7EB] text-[#9CA3AF] hover:text-[#1A1F36] focus:outline-none focus:ring-2 focus:ring-[#5C4EBF] transition-colors"
        aria-label="Clear search">
        
          <XIcon className="h-4 w-4" />
        </button>
      }
    </div>);

}