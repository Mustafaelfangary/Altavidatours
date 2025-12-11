import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark: 'hsl(var(--primary-dark))',
          light: 'hsl(var(--primary-light))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          dark: 'hsl(var(--secondary-dark))',
          light: 'hsl(var(--secondary-light))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Enhanced Egyptian-inspired color palette
        'egyptian-blue': {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '800': '#075985',
          '900': '#0c4a6e',
          '950': '#082f49',
        },
        'egyptian-gold': {
          '50': '#fff9ed',
          '100': '#fef3d9',
          '200': '#fce5b3',
          '300': '#fad58a',
          '400': '#f8c05a',
          '500': '#f59e0b',
          '600': '#e67e22',
          '700': '#c05621',
          '800': '#9c4221',
          '900': '#7b341e',
        },
        'nile-green': {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#22c55e',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
        },
        
        // Modern accent colors
        'coral': '#FF6B6B',
        'coral-dark': '#e05a5a',
        'teal': '#0D9488',
        'teal-dark': '#0f766e',
        'amber': '#F59E0B',
        'amber-dark': '#d97706',
        
        // Brand aliases with new color scheme
        'brand-primary': '#0ea5e9',
        'brand-secondary': '#f59e0b',
        'brand-accent': '#10b981',
        'brand-dark': '#082f49',
        'brand-light': '#f0f9ff',

        // Clean text colors
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-accent': 'hsl(var(--text-accent))',
        
        // Egyptian-themed custom colors (CSS variables for utility classes)
        'nile-blue': 'hsl(var(--nile-blue))',
        'pharaoh-gold': 'hsl(var(--pharaoh-gold))',
        'ancient-stone': 'hsl(var(--ancient-stone))',
        'sunset-orange': 'hsl(var(--sunset-orange))',
        'lotus-pink': 'hsl(var(--lotus-pink))',
        'turquoise-nile': 'hsl(var(--turquoise-nile))',
        'royal-purple': 'hsl(var(--royal-purple))',
        'emerald-oasis': 'hsl(var(--emerald-oasis))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        heading: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'scale-in': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'ripple': 'ripple 0.6s ease-out',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(43, 85%, 58%, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(43, 85%, 58%, 0.5)' },
        },
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--secondary-dark)) 100%)',
        'gradient-hero': 'linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(16, 100%, 60%) 50%, hsl(142, 70%, 50%) 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')({
      classes: [
        'fade-in', 'fade-in-up', 'fade-in-down', 'fade-in-left', 'fade-in-right',
        'slide-up', 'slide-down', 'slide-in-left', 'slide-in-right',
        'pulse-slow', 'float', 'bounce-slow', 'scale-in', 'shimmer', 'ripple', 'glow'
      ]
    }),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
  important: true, // This ensures Tailwind classes override Material-UI styles
};

export default config; 