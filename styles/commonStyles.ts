
export type ThemeMode = 'light' | 'dark' | 'field';

export const colors = {
  // Primary colors
  primary: '#2563EB',
  secondary: '#10B981',
  accent: '#8B5CF6',
  highlight: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background colors
  background: '#FFFFFF',
  cardBackground: '#F9FAFB',
  
  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  
  // Border colors
  border: '#E5E7EB',
  
  // Additional colors
  card: '#FFFFFF',
  notification: '#EF4444',
};

export const darkColors = {
  // Primary colors
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#A78BFA',
  highlight: '#FBBF24',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#60A5FA',
  
  // Background colors
  background: '#111827',
  cardBackground: '#1F2937',
  
  // Text colors
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  
  // Border colors
  border: '#374151',
  
  // Additional colors
  card: '#1F2937',
  notification: '#EF4444',
};

export const fieldColors = {
  // Primary colors - High contrast for outdoor visibility
  primary: '#FF6B00',
  secondary: '#00C853',
  accent: '#9C27B0',
  highlight: '#FFD600',
  success: '#00C853',
  error: '#FF1744',
  warning: '#FFD600',
  info: '#2196F3',
  
  // Background colors - Slightly tinted for reduced glare
  background: '#F5F5DC',
  cardBackground: '#FFFFFF',
  
  // Text colors - High contrast
  text: '#000000',
  textSecondary: '#424242',
  
  // Border colors
  border: '#BDBDBD',
  
  // Additional colors
  card: '#FFFFFF',
  notification: '#FF1744',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
};

export function getTheme(mode: ThemeMode) {
  switch (mode) {
    case 'dark':
      return darkColors;
    case 'field':
      return fieldColors;
    case 'light':
    default:
      return colors;
  }
}
