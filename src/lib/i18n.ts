import { useLanguage } from '@/context/language-context';
import enCommon from '../messages/en/common.clean.json';
import frCommon from '../messages/fr/common.json';
import esCommon from '../messages/es/common.json';
import ptCommon from '../messages/pt/common.json';
import ruCommon from '../messages/ru/common.json';
import itCommon from '../messages/it/common.json';

type TranslationDict = Record<string, string>;

const translations: Record<string, TranslationDict> = {
  en: enCommon as TranslationDict,
  fr: frCommon as TranslationDict,
  es: esCommon as TranslationDict,
  pt: ptCommon as TranslationDict,
  ru: ruCommon as TranslationDict,
  it: itCommon as TranslationDict,
};

export function useTranslation() {
  const { language } = useLanguage();

  return (key: string): string => {
    const lang = language in translations ? language : 'en';
    const dict = translations[lang] ?? translations.en;

    return dict[key] ?? translations.en[key] ?? key;
  };
}