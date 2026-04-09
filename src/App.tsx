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
  const { getERPConfig, apiError } = useERPContext();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('adminAuth') === 'true'
  );
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (erpId === 'admin') {
    if (!isAdminAuthenticated) {
      navigate(null);
      setShowAuthModal(true);
      return null;
    }
    return (
      <Layout
        erpConfig={null}
        currentSection="admin"
        onNavigate={() => navigate(null)}
        onNavigateHome={() => navigate(null)}
      >
        {apiError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg">
            ⚠️ {apiError}
          </div>
        )}
        <AdminPage />
      </Layout>
    );
  }

  const erpConfig = getERPConfig(erpId);
  if (erpId && !erpConfig) {
    navigate(null);
    return null;
  }

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

  const renderContent = () => {
    if (!erpConfig) {
      return <LandingPage onSelectERP={(id) => navigate(id)} />;
    }
    switch (section) {
      case 'overview':
        return (
          <OverviewPage
            erpConfig={erpConfig}
            onNavigate={(sec) => navigate(erpConfig.id, sec)}
          />
        );
      case 'resources':
        return (
          <ResourcesPage
            erpConfig={erpConfig}
            initialSubsection={subsection}
            onNavigate={(sec, sub) => navigate(erpConfig.id, sec, sub)}
          />
        );
      default:
        return (
          <OverviewPage
            erpConfig={erpConfig}
            onNavigate={(sec) => navigate(erpConfig.id, sec)}
          />
        );
    }
  };

  return (
    <>
      <Layout
        erpConfig={erpConfig}
        currentSection={section}
        onNavigate={(sec) => navigate(erpId, sec)}
        onNavigateHome={() => navigate(null)}
        onAdminClick={handleAdminClick}
      >
        {renderContent()}
      </Layout>

      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

export function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
}
