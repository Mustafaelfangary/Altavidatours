'use client';

import { Providers } from '@/providers';
import { locales } from '@/i18n';
import { notFound } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params: paramsPromise }: Props) {
  const [locale, setLocale] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { locale: localeValue } = await paramsPromise;
        if (!locales.includes(localeValue as any)) {
          notFound();
        }
        setLocale(localeValue);
        const msgs = (await import(`@/messages/${localeValue}.json`)).default;
        setMessages(msgs);
      } catch (error) {
        console.error('Failed to load messages:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [paramsPromise]);

  if (isLoading || !locale || !messages) {
    return (
      <html lang="en" dir="ltr">
        <body>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}