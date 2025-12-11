import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguageState(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


