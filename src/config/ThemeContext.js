import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../assets/css/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Theme Context
export const ThemeContext = createContext({
  isDarkMode: false,
  colors: lightTheme,
  toggleTheme: () => {},
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? darkTheme : lightTheme;

  // Toggle theme function
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('themeMode', newMode ? 'dark' : 'light');
  };

  // Initialize theme from AsyncStorage
  useEffect(() => {
    const fetchThemeMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('themeMode');
        if (storedMode) {
          setIsDarkMode(storedMode === 'dark');
        }
      } catch (error) {
        console.error('Error fetching theme mode:', error);
      }
    };

    fetchThemeMode();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);
