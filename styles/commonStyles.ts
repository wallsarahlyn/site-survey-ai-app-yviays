
export type ThemeMode = 'light' | 'dark' | 'field';

// Enhanced Professional Color Theme Palette
// Primary: Deep Orange (#FF5722) - Professional contractor orange
// Secondary: Slate Blue (#4A5568) - Professional neutral
// Accent: Vibrant Orange (#FF6B35) - Energetic highlight
// Background: Clean whites and grays for professionalism
// Success: Professional Green (#10B981)
// Warning: Amber (#F59E0B)

export const colors = {
  // Primary colors - Professional Deep Orange
  primary: '#FF5722', // Deep Orange - Primary CTA
  primaryLight: '#FF7043', // Lighter orange for hover states
  primaryDark: '#E64A19', // Darker orange for pressed states
  
  // Secondary colors - Professional Slate
  secondary: '#4A5568', // Slate gray for secondary elements
  secondaryLight: '#64748B', // Lighter slate
  secondaryDark: '#334155', // Darker slate
  
  // Accent colors
  accent: '#FF6B35', // Vibrant orange for highlights
  accentLight: '#FF8C61', // Lighter accent
  
  // Status colors
  success: '#10B981', // Professional green
  error: '#EF4444', // Professional red
  warning: '#F59E0B', // Amber warning
  info: '#3B82F6', // Professional blue
  
  // Background colors - Clean and professional
  background: '#FFFFFF', // Pure white
  backgroundSecondary: '#F8FAFC', // Very light gray
  cardBackground: '#FFFFFF', // White cards
  
  // Text colors
  text: '#1E293B', // Dark slate for primary text
  textSecondary: '#64748B', // Medium slate for secondary text
  textTertiary: '#94A3B8', // Light slate for tertiary text
  
  // Border colors
  border: '#E2E8F0', // Light border
  borderDark: '#CBD5E1', // Darker border
  
  // Navigation colors
  navigationBackground: '#FFFFFF', // White navigation
  tabBarBackground: '#FFFFFF', // White tab bar
  
  // Additional colors
  card: '#FFFFFF',
  notification: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Shadows
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
};

export const darkColors = {
  // Primary colors - Deep Orange (consistent across themes)
  primary: '#FF5722',
  primaryLight: '#FF7043',
  primaryDark: '#E64A19',
  
  // Secondary colors - Lighter slate for dark mode
  secondary: '#64748B',
  secondaryLight: '#94A3B8',
  secondaryDark: '#475569',
  
  // Accent colors
  accent: '#FF6B35',
  accentLight: '#FF8C61',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background colors - Professional dark
  background: '#0F172A', // Dark slate
  backgroundSecondary: '#1E293B', // Lighter dark slate
  cardBackground: '#1E293B', // Card background
  
  // Text colors
  text: '#F1F5F9', // Light text
  textSecondary: '#CBD5E1', // Medium light text
  textTertiary: '#94A3B8', // Tertiary text
  
  // Border colors
  border: '#334155', // Dark border
  borderDark: '#475569', // Darker border
  
  // Navigation colors
  navigationBackground: '#1E293B',
  tabBarBackground: '#1E293B',
  
  // Additional colors
  card: '#1E293B',
  notification: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Shadows
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowMedium: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.4)',
};

export const fieldColors = {
  // Primary colors - High contrast for outdoor
  primary: '#FF5722',
  primaryLight: '#FF7043',
  primaryDark: '#E64A19',
  
  // Secondary colors
  secondary: '#64748B',
  secondaryLight: '#94A3B8',
  secondaryDark: '#475569',
  
  // Accent colors - High visibility
  accent: '#FF6B35',
  accentLight: '#FF8C61',
  
  // Status colors - High contrast
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background colors - Slightly darker for outdoor visibility
  background: '#F8FAFC',
  backgroundSecondary: '#E2E8F0',
  cardBackground: '#FFFFFF',
  
  // Text colors - High contrast
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  
  // Border colors
  border: '#CBD5E1',
  borderDark: '#94A3B8',
  
  // Navigation colors
  navigationBackground: '#FFFFFF',
  tabBarBackground: '#FFFFFF',
  
  // Additional colors
  card: '#FFFFFF',
  notification: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  // Shadows
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
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
