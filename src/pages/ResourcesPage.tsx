import React, { useEffect, useState, useRef } from 'react';
import { ERPConfig, ResourceItem } from '../config/erpConfig';
import { SearchBar } from '../components/SearchBar';
import { ARIAChatPage } from './ARIAChatPage';
import {
  ChevronRightIcon,
  FileTextIcon,
  DownloadIcon,
  PlayCircleIcon,
  SparklesIcon,
  BookOpenIcon,
  XIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface ResourcesPageProps {
  erpConfig: ERPConfig;
  initialSubsection: string | null;
  onNavigate: (section: string, subsection?: string) => void;
}
export function ResourcesPage({
  erpConfig,
  initialSubsection,
  onNavigate
}: ResourcesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResourceId, setActiveResourceId] = useState<string>(() => {
    if (initialSubsection) {
      return initialSubsection;
    }
    return erpConfig.resources[0]?.id || '';
  });
  const [ariaOpen, setAriaOpen] = useState(false);
  const [ariaPrompt, setAriaPrompt] = useState<string | null>(null);
  const ariaPromptUsedRef = useRef(false);
  useEffect(() => {
    if (initialSubsection && initialSubsection !== activeResourceId) {
      setActiveResourceId(initialSubsection);
    }
  }, [initialSubsection, erpConfig]);
  const handleSelect = (id: string) => {
    setActiveResourceId(id);
    onNavigate('resources', id);
  };
  const handleDownload = (resource: ResourceItem) => {
    console.log(`Simulating download for: ${resource.downloadFileName}`);
    alert(`Downloading ${resource.downloadFileName}...`);
  };
  const handleAskAria = (resource: ResourceItem) => {
    const prompt = `I'm looking at the "${resource.title}" documentation for ${erpConfig.name}. ${resource.description}. Can you help me understand this better?`;
    ariaPromptUsedRef.current = false;
    setAriaPrompt(prompt);
    setAriaOpen(true);
  };
  const handleCloseAria = () => {
    setAriaOpen(false);
    setAriaPrompt(null);
  };
  const handleAriaPromptUsed = () => {
    ariaPromptUsedRef.current = true;
  };
  const getResourceIcon = (resource: ResourceItem) => {
    if (resource.type === 'video') {
      return <PlayCircleIcon className="h-5 w-5 text-[#E8567F]" />;
    }
    if (resource.type === 'document') {
      return <FileTextIcon className="h-5 w-5 text-[#E8567F]" />;
    }
    switch (resource.icon) {
      case 'pdf':
        return <FileTextIcon className="h-5 w-5 text-[#5C4EBF]" />;
      case 'video':
        return <PlayCircleIcon className="h-5 w-5 text-[#E8567F]" />;
      default:
        return <BookOpenIcon className="h-5 w-5 text-[#5C4EBF]" />;
    }
  };
  const filteredResources = erpConfig.resources.filter(
    (resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const activeResource = erpConfig.resources.find(
    (r) => r.id === activeResourceId
  );
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
        {/* Left Sidebar - Resource List */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-6 bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
            <SearchBar
              placeholder="Search resources..."
              onSearch={setSearchQuery} />
            

            <div className="space-y-1">
              <div className="px-2 py-2 text-sm font-bold text-[#1A1F36] uppercase tracking-wider flex items-center">
                <BookOpenIcon className="h-4 w-4 mr-2 text-[#4B5563]" />
                Documentation
              </div>

              <div className="space-y-1">
                {filteredResources.length > 0 ?
                filteredResources.map((resource) =>
                <button
                  key={resource.id}
                  onClick={() => handleSelect(resource.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeResourceId === resource.id ? 'bg-[#5C4EBF]/10 text-[#1A1F36] font-semibold' : 'text-[#4B5563] hover:bg-[#F5F7FA] hover:text-[#1A1F36]'}`}>
                  
                      <span
                    className={`mr-3 flex-shrink-0 ${activeResourceId === resource.id ? 'text-[#5C4EBF]' : 'text-[#9CA3AF]'}`}>
                    
                        {getResourceIcon(resource)}
                      </span>
                      <span className="truncate">{resource.title}</span>
                    </button>
                ) :

                <p className="text-sm text-[#9CA3AF] px-3 italic py-2">
                    No matching resources.
                  </p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area - Preview */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
          {/* Breadcrumb */}
          <div className="bg-[#F5F7FA] px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center text-sm text-[#4B5563]">
              <span>Resources</span>
              <ChevronRightIcon className="h-4 w-4 mx-2 text-[#9CA3AF]" />
              <span className="font-semibold text-[#1A1F36]">
                {activeResource?.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {activeResource?.downloadUrl &&
              <button
                onClick={() => handleDownload(activeResource)}
                className="inline-flex items-center px-4 py-2 border border-[#E5E7EB] shadow-sm text-sm font-semibold rounded-lg text-[#1A1F36] bg-white hover:bg-[#5C4EBF] hover:border-[#5C4EBF] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C4EBF] transition-all"
                aria-label={`Download ${activeResource.downloadFileName}`}>
                
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </button>
              }
              {activeResource &&
              <button
                onClick={() => handleAskAria(activeResource)}
                className="inline-flex items-center px-4 py-2 border border-[#5C4EBF] shadow-sm text-sm font-semibold rounded-lg text-[#5C4EBF] bg-[#5C4EBF]/10 hover:bg-[#5C4EBF] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C4EBF] transition-all"
                aria-label="Ask ARIA about this resource">
                
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Ask ARIA
                </button>
              }
            </div>
          </div>

          <div className="p-6 md:p-10 flex-1 overflow-y-auto">
            {activeResource &&
            <div className="animate-in fade-in duration-300">
                {/* Resource Header */}
                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <div className="mr-4 mt-1">
                      {getResourceIcon(activeResource)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-[#1A1F36] mb-2">
                        {activeResource.title}
                      </h2>
                      <p className="text-[#4B5563]">
                        {activeResource.description}
                      </p>
                      {activeResource.lastUpdated &&
                    <p className="text-sm text-[#9CA3AF] mt-2">
                          Last updated: {activeResource.lastUpdated}
                        </p>
                    }
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                {activeResource.type === 'video' && activeResource.videoUrl &&
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-[#E5E7EB]">
                    <iframe
                  src={activeResource.videoUrl}
                  title={activeResource.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen>
                </iframe>
                  </div>
              }

                {activeResource.type === 'document' &&
              activeResource.pdfUrl &&
              <div
                className="w-full rounded-xl overflow-hidden shadow-lg border border-[#E5E7EB]"
                style={{
                  height: '80vh'
                }}>
                
                      <iframe
                  src={activeResource.pdfUrl}
                  title={activeResource.title}
                  className="w-full h-full">
                </iframe>
                    </div>
              }

                {activeResource.type === 'guidance' &&
              activeResource.content &&
              <div className="prose prose-slate max-w-none">
                      {typeof activeResource.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: activeResource.content }} />
                      ) : (
                        activeResource.content
                      )}
                    </div>
              }
              </div>
            }

            {!activeResource &&
            <div className="text-center py-16 text-[#4B5563]">
                Resource not found. Please select a resource from the sidebar.
              </div>
            }
          </div>
        </div>
      </div>

      {/* ARIA Slide-out Drawer */}
      <AnimatePresence>
        {ariaOpen &&
        <>
            {/* Backdrop */}
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.2
            }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={handleCloseAria} />
          

            {/* Drawer Panel */}
            <motion.div
            initial={{
              x: '100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '100%'
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">
            
              {/* Drawer Header */}
              <div className="bg-[#1A1F36] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-[#5C4EBF] mr-3" />
                  <div>
                    <h3 className="text-white font-bold text-lg">Ask ARIA</h3>
                    <p className="text-white/60 text-xs">
                      About: {activeResource?.title}
                    </p>
                  </div>
                </div>
                <button
                onClick={handleCloseAria}
                className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close ARIA">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden">
                <ARIAChatPage
                erpConfig={erpConfig}
                embedded={true}
                initialPrompt={ariaPrompt}
                onPromptUsed={handleAriaPromptUsed} />
              
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}