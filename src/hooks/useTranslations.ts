import { useTranslations as useNextIntlTranslations } from 'next-intl';

type NestedObject = {
  [key: string]: string | NestedObject;
};

type TranslationFunction = (key: string, values?: Record<string, any>) => string;

export function useTranslations(namespace?: string): TranslationFunction {
  const t = useNextIntlTranslations(namespace || '');
  
  return (key: string, values?: Record<string, any>): string => {
    try {
      if (namespace) {
        return t(key, values);
      }
      // If no namespace, assume the key is in format 'namespace.key'
      const [ns, ...rest] = key.split('.');
      if (rest.length === 0) {
        return t(key, values) || key;
      }
      return t(rest.join('.'), values) || key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key; // Return the key as fallback
    }
  };
}
