
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';

// InspectAI Theme System
export type ThemeMode = 'light' | 'dark' | 'field';

// Enhanced Light theme with modern, professional colors
const lightTheme = {
  // Backgrounds - Softer, more modern
  background: '#F5F7FA',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E8ECEF',
  
  // Surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text - Better contrast
  text: '#1A1F36',
  textSecondary: '#697386',
  textTertiary: '#9AA5B1',
  textInverse: '#FFFFFF',
  
  // Primary - Modern Blue
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  
  // Secondary - Fresh Green
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent - Vibrant Teal
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  accentDark: '#0891B2',
  
  // Highlight - Purple
  highlight: '#8B5CF6',
  highlightLight: '#A78BFA',
  highlightDark: '#7C3AED',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers - Subtle
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
};

const darkTheme = {
  // Backgrounds - Deep, rich dark
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  
  // Surfaces
  surface: '#1E293B',
  surfaceElevated: '#334155',
  card: '#1E293B',
  
  // Text
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#0F172A',
  
  // Primary - Brighter for dark mode
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  
  // Secondary - Vibrant Green
  secondary: '#34D399',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#10B981',
  
  // Accent - Bright Teal
  accent: '#22D3EE',
  accentLight: '#67E8F9',
  accentDark: '#06B6D4',
  
  // Highlight - Purple
  highlight: '#A78BFA',
  highlightLight: '#C4B5FD',
  highlightDark: '#8B5CF6',
  
  // Status Colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Borders & Dividers
  border: '#334155',
  borderLight: '#1E293B',
  divider: '#334155',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
};

const fieldTheme = {
  // High-visibility backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FA',
  backgroundTertiary: '#E8ECEF',
  
  // High contrast surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  
  // High contrast text
  text: '#000000',
  textSecondary: '#1A1F36',
  textTertiary: '#334155',
  textInverse: '#FFFFFF',
  
  // Primary - High contrast blue
  primary: '#1E40AF',
  primaryLight: '#2563EB',
  primaryDark: '#1E3A8A',
  
  // Secondary - High contrast green
  secondary: '#047857',
  secondaryLight: '#059669',
  secondaryDark: '#065F46',
  
  // Accent - Bright teal for visibility
  accent: '#0891B2',
  accentLight: '#06B6D4',
  accentDark: '#0E7490',
  
  // Highlight - Purple
  highlight: '#7C3AED',
  highlightLight: '#8B5CF6',
  highlightDark: '#6D28D9',
  
  // Status Colors - High visibility
  success: '#047857',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
  
  // Borders - High contrast
  border: '#1A1F36',
  borderLight: '#334155',
  divider: '#1A1F36',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.6)',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
};

export const getTheme = (mode: ThemeMode) => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'field':
      return fieldTheme;
    default:
      return lightTheme;
  }
};

// Default export for backward compatibility - now defaults to light theme
export const colors = lightTheme;

// Hook to get current theme
export const useTheme = (mode?: ThemeMode) => {
  const systemColorScheme = useColorScheme();
  // Default to light theme unless explicitly set to dark
  const effectiveMode = mode || 'light';
  return getTheme(effectiveMode);
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.3)',
    elevation: 4,
  },
  secondary: {
    backgroundColor: lightTheme.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(16, 185, 129, 0.3)',
    elevation: 4,
  },
  accent: {
    backgroundColor: lightTheme.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(6, 182, 212, 0.3)',
    elevation: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: lightTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: lightTheme.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1200,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: lightTheme.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: lightTheme.textSecondary,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: lightTheme.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: lightTheme.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: lightTheme.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
    elevation: 4,
  },
  cardCompact: {
    backgroundColor: lightTheme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: lightTheme.divider,
    marginVertical: 16,
  },
});
