import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

function toString(val: string | string[] | undefined): string {
  return typeof val === 'string' ? val : Array.isArray(val) ? val.join(', ') : '';
}

export default function ThemeCSSVariables() {
  const { settings } = useSettings();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    // Set CSS variables for theme settings
    if (settings.theme_primary_color) root.style.setProperty('--theme-primary', toString(settings.theme_primary_color));
    if (settings.theme_secondary_color) root.style.setProperty('--theme-secondary', toString(settings.theme_secondary_color));
    if (settings.theme_background_color) root.style.setProperty('--theme-background', toString(settings.theme_background_color));
    if (settings.theme_text_color) root.style.setProperty('--theme-text', toString(settings.theme_text_color));
    if (settings.theme_navbar_bg) root.style.setProperty('--theme-navbar-bg', toString(settings.theme_navbar_bg));
    if (settings.theme_footer_bg) root.style.setProperty('--theme-footer-bg', toString(settings.theme_footer_bg));
    if (settings.theme_button_radius) root.style.setProperty('--theme-button-radius', toString(settings.theme_button_radius));
  }, [settings]);

  return null;
} 