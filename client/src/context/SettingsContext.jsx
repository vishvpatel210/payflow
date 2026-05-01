import React, { createContext, useContext, useEffect } from 'react';
import useSettings from '../hooks/useSettings';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { settings, loading, fetchSettings, formatCurrency } = useSettings();

  useEffect(() => {
    if (settings) {
      // Apply Dark Mode
      if (settings.appearance?.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Apply Theme Color
      if (settings.appearance?.themeColor) {
        document.documentElement.style.setProperty('--primary-color', settings.appearance.themeColor);
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(SettingsContext);
