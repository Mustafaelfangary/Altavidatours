"use client";
export const dynamic = "force-dynamic";

import SignUpForm from "@/components/auth/SignUpForm";
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignUpPage() {
  const { t } = useLanguage();
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-[400px]">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">{t('auth.createAccount')}</h1>
          <p className="text-text-primary">
            {t('auth.signUp')}
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 