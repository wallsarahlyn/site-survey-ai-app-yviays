
export type ThemeMode = 'light' | 'dark' | 'field';

// Advanced Color Theme Palette
// Primary CTA Buttons: Deep Orange
// Top Navigation / Footer: Charcoal (#0F0F10)
// Background: Gunmetal Gray or Soft Black
// Cards: Dark Gray (#2B2D31) with white text
// Highlight Elements (AI badges, icons): Teal or Yellow
// Warnings: Safety Yellow
// Success: Mint/Teal Green

export const colors = {
  // Primary colors - Deep Orange for CTAs
  primary: '#FF5722', // Deep Orange
  secondary: '#FF7043', // Lighter Deep Orange
  accent: '#00BCD4', // Teal for highlights
  highlight: '#FFD600', // Yellow for highlights
  success: '#00E5A0', // Mint/Teal Green
  error: '#FF3B30',
  warning: '#FFD600', // Safety Yellow
  info: '#00BCD4',
  
  // Background colors - Gunmetal Gray / Soft Black
  background: '#1A1A1D', // Soft Black
  cardBackground: '#2B2D31', // Dark Gray for cards
  
  // Text colors
  text: '#FFFFFF', // White text for cards
  textSecondary: '#B0B3B8', // Light gray for secondary text
  
  // Border colors
  border: '#3A3B3F', // Slightly lighter than card background
  
  // Navigation colors
  navigationBackground: '#0F0F10', // Charcoal for top nav/footer
  
  // Additional colors
  card: '#2B2D31',
  notification: '#FF3B30',
};

export const darkColors = {
  // Primary colors - Deep Orange for CTAs
  primary: '#FF5722', // Deep Orange
  secondary: '#FF7043', // Lighter Deep Orange
  accent: '#00BCD4', // Teal for highlights
  highlight: '#FFD600', // Yellow for highlights
  success: '#00E5A0', // Mint/Teal Green
  error: '#FF3B30',
  warning: '#FFD600', // Safety Yellow
  info: '#00BCD4',
  
  // Background colors - Gunmetal Gray / Soft Black
  background: '#1A1A1D', // Soft Black
  cardBackground: '#2B2D31', // Dark Gray for cards
  
  // Text colors
  text: '#FFFFFF', // White text for cards
  textSecondary: '#B0B3B8', // Light gray for secondary text
  
  // Border colors
  border: '#3A3B3F', // Slightly lighter than card background
  
  // Navigation colors
  navigationBackground: '#0F0F10', // Charcoal for top nav/footer
  
  // Additional colors
  card: '#2B2D31',
  notification: '#FF3B30',
};

export const fieldColors = {
  // Primary colors - High contrast for outdoor visibility
  primary: '#FF5722', // Deep Orange
  secondary: '#FF7043', // Lighter Deep Orange
  accent: '#00BCD4', // Teal for highlights
  highlight: '#FFD600', // Yellow for highlights (high visibility)
  success: '#00E5A0', // Mint/Teal Green
  error: '#FF1744',
  warning: '#FFD600', // Safety Yellow (high visibility)
  info: '#00BCD4',
  
  // Background colors - Slightly lighter for outdoor visibility
  background: '#2A2A2D', // Lighter gunmetal for better visibility
  cardBackground: '#3B3D41', // Lighter dark gray
  
  // Text colors - High contrast
  text: '#FFFFFF',
  textSecondary: '#E0E0E0',
  
  // Border colors
  border: '#4A4B4F',
  
  // Navigation colors
  navigationBackground: '#0F0F10', // Charcoal
  
  // Additional colors
  card: '#3B3D41',
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
