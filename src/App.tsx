import React, { useState } from 'react';
import { useHashRouter } from './hooks/useHashRouter';
import { ERPProvider, useERPContext } from './context/ERPContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AdminPage } from './pages/AdminPage';
import { AdminAuthModal } from './components/AdminAuthModal';
function AppContent() {
  const { erpId, section, subsection, navigate } = useHashRouter();
  const { getERPConfig } = useERPContext();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('adminAuth') === 'true'
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Handle admin route
  if (erpId === 'admin') {
    if (!isAdminAuthenticated) {
      // If not authenticated, redirect to home and show modal
      navigate(null);
      setShowAuthModal(true);
      return null;
    }
    return (
      <Layout
        erpConfig={null}
        currentSection="admin"
        onNavigate={(sec) => navigate(null)}
        onNavigateHome={() => navigate(null)}>
        
        <AdminPage />
      </Layout>);

  }
  // Get config based on URL hash
  const erpConfig = getERPConfig(erpId);
  // If there's an erpId in the URL but it's invalid, redirect to landing
  if (erpId && !erpConfig) {
    navigate(null);
    return null;
  }
  const handleNavigateHome = () => {
    navigate(null);
  };
  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      navigate('admin');
    } else {
      setShowAuthModal(true);
    }
  };
  const handleLogin = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('adminAuth', 'true');
    navigate('admin');
  };
  // Render appropriate page content
  const renderContent = () => {
    if (!erpConfig) {
      return <LandingPage onSelectERP={(id) => navigate(id)} />;
    }
    switch (section) {
      case 'overview':
        return (
          <OverviewPage
            erpConfig={erpConfig}
            onNavigate={(sec) => navigate(erpConfig.id, sec)} />);


      case 'resources':
        return (
          <ResourcesPage
            erpConfig={erpConfig}
            initialSubsection={subsection}
            onNavigate={(sec, sub) => navigate(erpConfig.id, sec, sub)} />);


      default:
        return (
          <OverviewPage
            erpConfig={erpConfig}
            onNavigate={(sec) => navigate(erpConfig.id, sec)} />);


    }
  };
  return (
    <>
      <Layout
        erpConfig={erpConfig}
        currentSection={section}
        onNavigate={(sec) => navigate(erpId, sec)}
        onNavigateHome={handleNavigateHome}
        onAdminClick={handleAdminClick}>
        
        {renderContent()}
      </Layout>

      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin} />
      
    </>);

}
export function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>);

}