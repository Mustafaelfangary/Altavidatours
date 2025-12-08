'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Language codes mapping
const LANG_MAP: Record<string, string> = {
  'en': 'en',
  'ar': 'ar',
  'fr': 'fr',
  'de': 'de',
  'es': 'es',
  'it': 'it',
  'ru': 'ru',
  'zh': 'zh-CN',
  'ja': 'ja'
};

function AutoTranslateClient() {
  const [language, setLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Listen to language changes from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage !== language) {
      setLanguage(savedLanguage);
    }

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Only process if the event is from another tab or a custom event
      if ((e instanceof StorageEvent && e.key === 'language') || e.type === 'languageChange') {
        const newLanguage = localStorage.getItem('language') || 'en';
        if (newLanguage !== language) {
          setLanguage(newLanguage);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleStorageChange as EventListener);
    };
  }, [language]);

  useEffect(() => {
    // Only run in browser and if not already initialized
    if (typeof window === 'undefined' || isInitialized) return;

    // Cleanup function to prevent memory leaks
    let observer: MutationObserver | null = null;
    let script: HTMLScriptElement | null = null;

    // Initialize Google Translate
    const initGoogleTranslate = () => {
      // Remove existing Google Translate elements
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Add Google Translate script
      script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      // Handle script load errors
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
        setIsInitialized(false);
      };

      // Initialize Google Translate with better settings
      (window as any).googleTranslateElementInit = function() {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,ar,fr,de,es,it,ru,zh-CN,ja',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
              gaTrack: false,
              gaId: null
            },
            'google_translate_element'
          );
          
          // Set initialized flag
          setIsInitialized(true);
          
          // Set up mutation observer for dynamic content
          observer = new MutationObserver((mutations) => {
            // Only process if we have mutations and the translate widget is loaded
            if (mutations.length > 0 && document.querySelector('.goog-te-combo')) {
              const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
              if (selectElement && selectElement.value) {
                // Only trigger change if the language has actually changed
                const currentLang = selectElement.value;
                if (currentLang !== language) {
                  selectElement.dispatchEvent(new Event('change'));
                }
              }
            }
          });
          
          // Only observe the body for added nodes, not attribute changes
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
          setIsInitialized(false);
        }
      };

      // Add script to the document
      document.body.appendChild(script);
    };

    // Initialize Google Translate
    initGoogleTranslate();

    // Cleanup function
    return () => {
      // Disconnect the observer if it exists
      if (observer) {
        observer.disconnect();
      }
      
      // Remove the script if it exists
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      // Clean up the global function
      delete (window as any).googleTranslateElementInit;
    };
  }, [isInitialized, language]);

  // Trigger translation when language changes
  const triggerTranslation = useCallback(() => {
    if (typeof window === 'undefined' || !isInitialized) return;
    
    const targetLang = LANG_MAP[language] || 'en';
    
    try {
      if (targetLang === 'en') {
        // Reset to original English
        const frame = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement;
        if (frame) {
          const frameDoc = frame.contentDocument || (frame.contentWindow as Window)?.document;
          if (frameDoc) {
            const select = frameDoc.querySelector('select.goog-te-combo') as HTMLSelectElement;
            if (select) {
              select.value = 'en';
              select.dispatchEvent(new Event('change'));
            }
          }
        }
      } else if ((window as any).google?.translate) {
        // Use the Google Translate API if available
        const select = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
        if (select && select.value !== targetLang) {
          select.value = targetLang;
          select.dispatchEvent(new Event('change'));
        }
      }
    } catch (error) {
      console.error('Error triggering translation:', error);
    }
  }, [language, isInitialized]);

  // Trigger translation when language changes or when Google Translate is initialized
  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(triggerTranslation, 500);
      return () => clearTimeout(timer);
    }
  }, [language, isInitialized, triggerTranslation]);

  // Render a hidden div for Google Translate to attach to
  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Hide Google Translate banner and other elements */}
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        .goog-logo-link,
        .goog-te-gadget,
        .goog-te-combo,
        #google_translate_element,
        .skiptranslate {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }
        
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0 !important;
        }
      `}</style>
    </>
  );
}

// Export with SSR disabled
export default dynamic(() => Promise.resolve(AutoTranslateClient), {
  ssr: false
});
