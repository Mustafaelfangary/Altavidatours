'use client';

import { useEffect, useState } from 'react';

interface PharaonicDecorationProps {
  variant?: 'header' | 'footer' | 'section' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Pharaonic hieroglyphs for decoration
const pharaonicSymbols = [
  '𓎼', '𓇌', '𓊪', '𓏏', '𓅲', '𓂋', '𓋴', // Egipto Trips
  '𓆑', '𓏏', '𓅱', '𓏏', '𓂋', // Common symbols
  '𓊃', '𓏏', '𓅱', '𓏏', // Additional decorative
  '𓎟', '𓏏', '𓅱', '𓏏', // More symbols
  '𓀀', '𓀁', '𓀂', '𓀃', // Human figures
  '𓁹', '𓁺', '𓁻', // Eyes
  '𓂀', '𓂁', '𓂂', // Sun symbols
  '𓆣', '𓆤', '𓆥', // Ankh and life symbols
];

export function PharaonicDecoration({ 
  variant = 'section', 
  size = 'md',
  className = '' 
}: PharaonicDecorationProps) {
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    // Select random symbols based on variant
    const count = variant === 'header' ? 3 : variant === 'footer' ? 5 : variant === 'section' ? 2 : 1;
    const selected = pharaonicSymbols
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    setSymbols(selected);
  }, [variant]);

  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl'
  };

  if (variant === 'inline') {
    return (
      <span className={`inline-block ${sizeClasses[size]} text-pharaoh-gold ${className}`}>
        {symbols.join(' ')}
      </span>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {symbols.map((symbol, index) => (
          <span
            key={index}
            className={`${sizeClasses[size]} text-pharaoh-gold/60 animate-float`
              + (index % 2 === 0 ? ' animation-delay-0' : ' animation-delay-300')}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {symbol}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        {symbols.map((symbol, index) => (
          <span
            key={index}
            className={`${sizeClasses[size]} text-pharaoh-gold/50 opacity-70`
              + (index % 2 === 0 ? ' animate-float' : '')}
            style={{ animationDelay: `${index * 300}ms` }}
          >
            {symbol}
          </span>
        ))}
      </div>
    );
  }

  // Section variant (default)
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {symbols.map((symbol, index) => (
        <span
          key={index}
          className={`${sizeClasses[size]} text-pharaoh-gold/70 transform transition-all duration-1000 hover:scale-110 hover:text-pharaoh-gold`
            + (index % 2 === 0 ? ' animate-float' : '')}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}

// Pharaonic text component for "Egipto Trips"
export function PharaonicText({ 
  className = '',
  showTranslation = true 
}: { 
  className?: string;
  showTranslation?: boolean;
}) {
  const pharaonicText = '𓎼𓇌𓊪𓏏 𓏏𓅲𓂋𓋴';
  const translation = 'Egipto Trips';

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="text-3xl md:text-5xl font-serif text-pharaoh-gold tracking-wider">
        {pharaonicText}
      </div>
      {showTranslation && (
        <div className="text-sm md:text-base text-ancient-stone/70 italic font-light">
          {translation}
        </div>
      )}
    </div>
  );
}

