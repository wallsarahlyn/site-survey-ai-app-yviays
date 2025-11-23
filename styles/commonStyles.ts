
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';

// TechOps Pro Theme System
export type ThemeMode = 'light' | 'dark' | 'field';

// Deep Navy & Charcoal with Electric Teal Accents
const lightTheme = {
  // Backgrounds
  background: '#F8F9FA',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E8EAED',
  
  // Navy & Charcoal
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text
  text: '#1A2332',
  textSecondary: '#5A6C7D',
  textTertiary: '#8B95A1',
  textInverse: '#FFFFFF',
  
  // Primary - Deep Navy
  primary: '#0F2847',
  primaryLight: '#1A3A5F',
  primaryDark: '#081829',
  
  // Secondary - Charcoal
  secondary: '#2C3E50',
  secondaryLight: '#34495E',
  secondaryDark: '#1C2833',
  
  // Accent - Electric Teal
  accent: '#00D9FF',
  accentLight: '#33E1FF',
  accentDark: '#00B8D9',
  
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
  
  // Navy & Charcoal
  surface: '#131920',
  surfaceElevated: '#1A2332',
  card: '#1A2332',
  
  // Text
  text: '#E8EAED',
  textSecondary: '#A0AEC0',
  textTertiary: '#718096',
  textInverse: '#0A0E14',
  
  // Primary - Deep Navy (lighter for dark mode)
  primary: '#1E4976',
  primaryLight: '#2A5A8F',
  primaryDark: '#0F2847',
  
  // Secondary - Charcoal (lighter for dark mode)
  secondary: '#3D5A73',
  secondaryLight: '#4A6B87',
  secondaryDark: '#2C3E50',
  
  // Accent - Electric Teal
  accent: '#00D9FF',
  accentLight: '#33E1FF',
  accentDark: '#00B8D9',
  
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
  
  // Primary - High contrast navy
  primary: '#0F2847',
  primaryLight: '#1A3A5F',
  primaryDark: '#081829',
  
  // Secondary - High contrast charcoal
  secondary: '#1A2332',
  secondaryLight: '#2C3E50',
  secondaryDark: '#0A0E14',
  
  // Accent - Bright teal for visibility
  accent: '#00E5FF',
  accentLight: '#4DFFFF',
  accentDark: '#00B8D9',
  
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

// Default export for backward compatibility
export const colors = lightTheme;

// Hook to get current theme
export const useTheme = (mode?: ThemeMode) => {
  const systemColorScheme = useColorScheme();
  const effectiveMode = mode || (systemColorScheme === 'dark' ? 'dark' : 'light');
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
