'use client';

import { ReactNode } from 'react';
import { useTranslate } from '@/hooks/useTranslate';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslateProps {
  children: ReactNode;
  text?: string;
}

// Component that translates its text content
export function T({ children, text }: TranslateProps) {
  const content = text || (typeof children === 'string' ? children : '');
  const translated = useTranslate(content);
  
  if (text) {
    return <>{translated}</>;
  }
  
  return <>{translated || children}</>;
}

// HOC to wrap components with translation
export function withTranslation<P extends object>(
  Component: React.ComponentType<P>,
  textProps: (keyof P)[]
) {
  return function TranslatedComponent(props: P) {
    const { locale } = useLanguage();
    const translatedProps = { ...props };

    // This would need async handling - better to use the hook directly
    return <Component {...translatedProps} />;
  };
}

export default T;
