"use client";
export const dynamic = "force-dynamic";

import SignInForm from "@/components/auth/SignInForm";
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignInPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            {t('auth.signIn')}
          </h2>
          <p className="mt-2 text-center text-sm text-text-primary">
            {t('auth.noAccount')}{" "}
            <a
              href="/auth/signup"
              className="font-medium text-text-primary hover:text-text-primary"
            >
              {t('auth.signUp')}
            </a>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 