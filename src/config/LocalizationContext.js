import React, { createContext, useContext, useState, useEffect } from 'react';
import Translations from './Translations';
import * as RNLocalize from 'react-native-localize'; // Import react-native-localize

const LocalizationContext = createContext();

export const useLocalization = () => useContext(LocalizationContext);

export const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode; // Get device language
    setLocale(deviceLanguage);
  }, []); // Run only once on component mount

  const t = (key) => {
    return Translations[locale][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};
