import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface PublishedPage {
  id: string;
  name: string;
  workspace: string;
  publishedAt: Date;
}

interface PublishedPagesContextType {
  publishedPages: PublishedPage[];
  addPublishedPage: (page: Omit<PublishedPage, 'id' | 'publishedAt'>) => void;
  activePage: PublishedPage | null;
  setActivePage: (page: PublishedPage | null) => void;
}

const PublishedPagesContext = createContext<PublishedPagesContextType>({
  publishedPages: [],
  addPublishedPage: () => {},
  activePage: null,
  setActivePage: () => {},
});

export function PublishedPagesProvider({ children }: { children: ReactNode }) {
  const [publishedPages, setPublishedPages] = useState<PublishedPage[]>([]);
  const [activePage, setActivePage] = useState<PublishedPage | null>(null);

  const addPublishedPage = useCallback((page: Omit<PublishedPage, 'id' | 'publishedAt'>) => {
    setPublishedPages(prev => [
      ...prev,
      {
        ...page,
        id: `page-${Date.now()}`,
        publishedAt: new Date(),
      },
    ]);
  }, []);

  return (
    <PublishedPagesContext.Provider value={{ publishedPages, addPublishedPage, activePage, setActivePage }}>
      {children}
    </PublishedPagesContext.Provider>
  );
}

export function usePublishedPages() {
  return useContext(PublishedPagesContext);
}
