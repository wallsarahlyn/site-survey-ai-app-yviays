
export type ThemeMode = 'light' | 'dark' | 'field';

// Yellow/Solar/Roofing Contractor Theme
export const colors = {
  // Primary colors - Warm yellows and golds for solar/roofing
  primary: '#FDB913', // Bright solar yellow
  secondary: '#FF8C00', // Dark orange (roofing accent)
  accent: '#D4A72C', // Gold accent
  highlight: '#FFD700', // Bright gold highlight
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background colors - Light, warm tones
  background: '#FFFBF0', // Warm off-white
  cardBackground: '#FFF9E6', // Light cream
  
  // Text colors
  text: '#2C2416', // Dark brown for contrast
  textSecondary: '#6B5D47', // Medium brown
  
  // Border colors
  border: '#E8D9B8', // Light tan border
  
  // Additional colors
  card: '#FFFFFF',
  notification: '#EF4444',
};

export const darkColors = {
  // Primary colors - Adjusted for dark mode
  primary: '#FDB913', // Keep bright yellow for visibility
  secondary: '#FF8C00', // Dark orange
  accent: '#D4A72C', // Gold accent
  highlight: '#FFD700', // Bright gold
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#60A5FA',
  
  // Background colors - Dark with warm undertones
  background: '#1A1612', // Very dark brown
  cardBackground: '#2C2416', // Dark brown
  
  // Text colors
  text: '#FFF9E6', // Light cream text
  textSecondary: '#B8A888', // Tan text
  
  // Border colors
  border: '#3D3426', // Dark tan border
  
  // Additional colors
  card: '#2C2416',
  notification: '#EF4444',
};

export const fieldColors = {
  // Primary colors - High contrast for outdoor visibility
  primary: '#FDB913', // Bright yellow for visibility
  secondary: '#FF6B00', // Bright orange
  accent: '#FFD700', // Bright gold
  highlight: '#FFED4E', // Very bright yellow
  success: '#00C853',
  error: '#FF1744',
  warning: '#FFD600',
  info: '#2196F3',
  
  // Background colors - Slightly tinted for reduced glare
  background: '#FFF8DC', // Cornsilk - reduces glare
  cardBackground: '#FFFFFF',
  
  // Text colors - High contrast
  text: '#000000',
  textSecondary: '#424242',
  
  // Border colors
  border: '#D4A72C',
  
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
