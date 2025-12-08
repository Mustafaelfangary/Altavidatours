"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface LogoLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  customText?: string;
  variant?: 'default' | 'minimal' | 'elegant';
  fullScreen?: boolean;
}

const sizeMap = {
  sm: { width: 60, height: 60, containerClass: 'w-16 h-16' },
  md: { width: 80, height: 80, containerClass: 'w-20 h-20' },
  lg: { width: 120, height: 120, containerClass: 'w-32 h-32' },
  xl: { width: 160, height: 160, containerClass: 'w-40 h-40' }
} as const;

export default function LogoLoader({
  className = '',
  size = 'lg',
  showText = false,
  customText = 'Loading...',
  variant = 'default',
  fullScreen = true
}: LogoLoaderProps) {
  const { width, height, containerClass } = sizeMap[size];
  const [logoUrl, setLogoUrl] = useState<string>('/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png');
  const [loadedOnce, setLoadedOnce] = useState<boolean>(false);

  // Fetch the same logo used by the site/navbar so the loader always matches
  useEffect(() => {
    let cancelled = false;
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/logo', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data?.logoUrl) {
            const ts = data?.timestamp || Date.now();
            const sep = data.logoUrl.includes('?') ? '&' : '?';
            setLogoUrl(`${data.logoUrl}${sep}t=${ts}`);
          }
        }
      } catch {
        // silent fallback to default logo
      }
    };
    fetchLogo();
    return () => { cancelled = true; };
  }, []);

  const logoElement = (
    <div className="relative">
      {/* Logo with gentle pulse animation */}
      <div
        className={cn(
          "animate-pulse",
          containerClass,
          variant === 'elegant' && "animate-pulse duration-1000"
        )}
      >
        <div className="relative w-full h-full">
          <Image
            src={logoUrl || '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png'}
            alt="Altavida Tours Logo"
            width={width}
            height={height}
            className={cn(
              "mx-auto drop-shadow-lg w-auto h-auto max-w-full max-h-full object-contain",
              variant === 'minimal' && "drop-shadow-none",
              variant === 'elegant' && "drop-shadow-xl filter brightness-110"
            )}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            priority
            unoptimized={true}
            onLoad={() => setLoadedOnce(true)}
            onError={() => {
              // fallback to default if the provided URL fails
              if (logoUrl !== '/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png') {
                setLogoUrl('/icons/AppIcons/android/mipmap-xxxhdpi/altavida.png');
              }
            }}
          />
        </div>
      </div>

      {/* Loading dots animation */}
      {variant !== 'minimal' && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s]",
                variant === 'elegant' ? "bg-tds-green" : "bg-tds-blue"
              )}
            ></div>
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s]",
                variant === 'elegant' ? "bg-tds-blue" : "bg-tds-green"
              )}
            ></div>
            <div
              className={cn(
                "h-2 w-2 rounded-full animate-bounce",
                variant === 'elegant' ? "bg-tds-blue-dark" : "bg-tds-orange"
              )}
            ></div>
          </div>
        </div>
      )}

      {/* Optional loading text */}
      {showText && (
        <p
          className={cn(
            "text-center mt-4 text-sm font-medium",
            variant === 'elegant' ? "text-tds-blue-dark" : "text-gray-600"
          )}
        >
          {customText}
        </p>
      )}
    </div>
  );

  if (!fullScreen) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        {logoElement}
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center",
      variant === 'elegant' 
        ? "bg-gradient-to-br from-tds-green-100 via-white to-tds-blue-50" 
        : "bg-gradient-to-b from-tds-green-50 to-white",
      className
    )}>
      {logoElement}
    </div>
  );
}

// Compact version for inline usage
export function LogoSpinner({ 
  size = 'sm', 
  className = '' 
}: Pick<LogoLoaderProps, 'size' | 'className'>) {
  return (
    <LogoLoader
      size={size}
      variant="minimal"
      fullScreen={false}
      className={className}
    />
  );
}
