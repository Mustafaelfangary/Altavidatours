'use client';

import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ProvidersProps = {
  children: ReactNode;
  locale?: string;
  messages?: any;
};

export function Providers({ children, locale: initialLocale, messages = {} }: ProvidersProps) {
  const [locale, setLocale] = useState(initialLocale || 'en');
  const pathname = usePathname();

  // Update locale when pathname changes
  useEffect(() => {
    if (pathname) {
      const newLocale = pathname.split('/')[1];
      if (newLocale && newLocale !== locale) {
        setLocale(newLocale);
      }
    }
  }, [pathname]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
