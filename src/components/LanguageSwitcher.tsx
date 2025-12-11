'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  // Add more languages as needed
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLanguage = (lang: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '');
    
    // If it's the default language, don't include the locale in the URL
    const newPath = lang === 'en' 
      ? `/${pathWithoutLocale}`
      : `/${lang}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <select
        value={currentLocale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-transparent border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
      >
        {languages.map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            className="bg-white text-gray-900"
          >
            {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}


