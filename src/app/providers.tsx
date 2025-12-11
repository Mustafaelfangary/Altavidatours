'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import { AuthProvider } from '@/components/providers/auth-provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { HomeButton } from '@/components/HomeButton';
import { LanguageProvider } from '@/context/language-context';
import SEO from '@/components/SEO';
import ThemeCSSVariables from '@/components/ThemeCSSVariables';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import enMessages from '@/messages/en.json';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  let locale: string = 'en';
  let messages: any = enMessages;
  try {
    locale = useLocale();
    messages = useMessages();
  } catch (err) {
    // Fallback for SSR/prerender (e.g., not-found)
    locale = 'en';
    messages = enMessages;
  }

  return (
    <>
      <SEO />
      <ThemeCSSVariables />
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Cairo">
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AuthProvider>
                  <LanguageProvider>
                    {children}
                  </LanguageProvider>
                  <HomeButton />
                </AuthProvider>
                <Toaster position="top-right" />
              </LocalizationProvider>
            </ThemeProvider>
          </NextThemesProvider>
        </NextIntlClientProvider>
      </QueryClientProvider>
    </>
  );
}


