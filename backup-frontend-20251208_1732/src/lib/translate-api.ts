// Translation API using LibreTranslate (free, open-source)
// You can also use Google Translate API, DeepL, or Microsoft Translator

const LIBRE_TRANSLATE_URL = 'https://libretranslate.com/translate';

interface TranslationCache {
  [key: string]: string;
}

// In-memory cache for translations
const translationCache: TranslationCache = {};

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  // Return original if target is English
  if (targetLang === 'en' || !text || text.trim() === '') {
    return text;
  }

  // Check cache first
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch(LIBRE_TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      console.warn('Translation API error:', response.statusText);
      return text;
    }

    const data = await response.json();
    const translatedText = data.translatedText || text;
    
    // Cache the translation
    translationCache[cacheKey] = translatedText;
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Batch translate multiple texts
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string[]> {
  if (targetLang === 'en') {
    return texts;
  }

  const promises = texts.map(text => translateText(text, targetLang, sourceLang));
  return Promise.all(promises);
}

// Translate object properties
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  targetLang: string,
  fieldsToTranslate: (keyof T)[]
): Promise<T> {
  if (targetLang === 'en') {
    return obj;
  }

  const translated = { ...obj };
  
  for (const field of fieldsToTranslate) {
    const value = obj[field];
    if (typeof value === 'string') {
      translated[field] = await translateText(value, targetLang) as any;
    } else if (Array.isArray(value)) {
      translated[field] = await translateBatch(value, targetLang) as any;
    }
  }

  return translated;
}

// Language code mapping
export const LANGUAGE_CODES: Record<string, string> = {
  'en': 'en',
  'ar': 'ar',
  'fr': 'fr',
  'de': 'de',
  'es': 'es',
  'it': 'it',
  'ru': 'ru',
  'zh': 'zh',
  'ja': 'ja'
};
