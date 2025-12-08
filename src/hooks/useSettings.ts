import { useState, useEffect } from 'react';
import { Settings, UseSettingsReturn } from '@/types/settings';

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<Settings>({} as Settings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      // Check if response has content before parsing
      const text = await response.text();
      if (!text) {
        console.warn('Settings API returned empty response');
        setSettings({} as Settings);
        return;
      }
      
      const data = JSON.parse(text);
      setSettings(data);
    } catch (err) {
      console.warn('Failed to fetch settings:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Set empty settings object as fallback
      setSettings({} as Settings);
    } finally {
      setLoading(false);
    }
  };

  const get = (key: string, fallback?: string | string[]): string | string[] => {
    const value = settings[key];
    if (value !== undefined) {
      return value;
    }
    return fallback || '';
  };

  const getByCategory = (category: string): Partial<Settings> => {
    return Object.fromEntries(
      Object.entries(settings).filter(([key]) => key.startsWith(category))
    );
  };

  const updateSettings = (newSettings: Partial<Settings>): void => {
    setSettings(prevSettings => {
      const filtered = Object.fromEntries(
        Object.entries(newSettings).filter(([_, v]) => v !== undefined)
      );
      return { ...prevSettings, ...filtered } as Settings;
    });
  };

  return {
    settings,
    loading,
    error,
    get,
    getByCategory,
    updateSettings,
    isLoading: loading,
  };
};