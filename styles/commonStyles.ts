
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';

// InspectAI Theme System
export type ThemeMode = 'light' | 'dark' | 'field';

// Light theme with clean, professional colors
const lightTheme = {
  // Backgrounds
  background: '#F8F9FA',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E8EAED',
  
  // Surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text
  text: '#1A2332',
  textSecondary: '#5A6C7D',
  textTertiary: '#8B95A1',
  textInverse: '#FFFFFF',
  
  // Primary - Professional Blue
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  
  // Secondary - Success Green
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent - Vibrant Orange
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  
  // Highlight - Purple
  highlight: '#8B5CF6',
  highlightLight: '#A78BFA',
  highlightDark: '#7C3AED',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

const darkTheme = {
  // Backgrounds
  background: '#0A0E14',
  backgroundSecondary: '#131920',
  backgroundTertiary: '#1A2332',
  
  // Surfaces
  surface: '#131920',
  surfaceElevated: '#1A2332',
  card: '#1A2332',
  
  // Text
  text: '#E8EAED',
  textSecondary: '#A0AEC0',
  textTertiary: '#718096',
  textInverse: '#0A0E14',
  
  // Primary - Professional Blue (lighter for dark mode)
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  
  // Secondary - Success Green
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent - Vibrant Orange
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  
  // Highlight - Purple
  highlight: '#8B5CF6',
  highlightLight: '#A78BFA',
  highlightDark: '#7C3AED',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers
  border: '#2D3748',
  borderLight: '#1A2332',
  divider: '#2D3748',
  
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
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E8EAED',
  
  // High contrast surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  
  // High contrast text
  text: '#000000',
  textSecondary: '#1A2332',
  textTertiary: '#2C3E50',
  textInverse: '#FFFFFF',
  
  // Primary - High contrast blue
  primary: '#1D4ED8',
  primaryLight: '#2563EB',
  primaryDark: '#1E40AF',
  
  // Secondary - High contrast green
  secondary: '#059669',
  secondaryLight: '#10B981',
  secondaryDark: '#047857',
  
  // Accent - Bright orange for visibility
  accent: '#EA580C',
  accentLight: '#F59E0B',
  accentDark: '#C2410C',
  
  // Highlight - Purple
  highlight: '#7C3AED',
  highlightLight: '#8B5CF6',
  highlightDark: '#6D28D9',
  
  // Status Colors - High visibility
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
  
  // Borders - High contrast
  border: '#000000',
  borderLight: '#2C3E50',
  divider: '#000000',
  
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
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: lightTheme.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: {
    backgroundColor: lightTheme.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
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
    fontSize: 28,
    fontWeight: '700',
    color: lightTheme.text,
    marginBottom: 8,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  cardCompact: {
    backgroundColor: lightTheme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
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
