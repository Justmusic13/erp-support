import { useState, useEffect, useCallback } from 'react';

export type RouteState = {
  erpId: string | null;
  section: string;
  subsection: string | null;
};

export function useHashRouter() {
  const [route, setRoute] = useState<RouteState>({
    erpId: null,
    section: 'overview',
    subsection: null
  });

  const parseHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      setRoute({ erpId: null, section: 'overview', subsection: null });
      return;
    }

    if (hash === 'admin') {
      setRoute({ erpId: 'admin', section: 'admin', subsection: null });
      return;
    }

    const parts = hash.split('/');
    setRoute({
      erpId: parts[0] || null,
      section: parts[1] || 'overview',
      subsection: parts[2] || null
    });
  }, []);

  useEffect(() => {
    // Parse initial hash
    parseHash();

    // Listen for changes
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [parseHash]);

  const navigate = useCallback(
    (erpId: string | null, section?: string, subsection?: string) => {
      if (!erpId) {
        window.location.hash = '';
        return;
      }

      if (erpId === 'admin') {
        window.location.hash = '#admin';
        return;
      }

      let newHash = `#${erpId}`;
      if (section) {
        newHash += `/${section}`;
        if (subsection) {
          newHash += `/${subsection}`;
        }
      }
      window.location.hash = newHash;
    },
    []
  );

  return { ...route, navigate };
}