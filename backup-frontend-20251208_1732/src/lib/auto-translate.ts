// Automatic translation system using Google Translate API or similar
// This will automatically translate all text content on the page

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;
  
  try {
    // Using Google Translate API (you'll need to add your API key)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Translate API key not found');
      return text;
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: 'text'
        })
      }
    );

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Cache translations to avoid repeated API calls
const translationCache = new Map<string, string>();

export function getCachedTranslation(text: string, lang: string): string | null {
  const key = `${lang}:${text}`;
  return translationCache.get(key) || null;
}

export function setCachedTranslation(text: string, lang: string, translation: string): void {
  const key = `${lang}:${text}`;
  translationCache.set(key, translation);
}
