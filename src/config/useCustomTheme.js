import { useTheme } from '../config/ThemeContext';

export const useCustomTheme = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return { isDarkMode, toggleTheme, colors };
};
