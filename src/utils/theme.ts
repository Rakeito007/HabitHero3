import { ThemeMode } from '../types/habit';

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceSecondary: '#E9ECEF',
  primary: '#007AFF',
  secondary: '#5856D6',
  text: '#000000',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  border: '#E5E5EA',
  cardBackground: '#FFFFFF',
  tabBarBackground: '#F8F9FA',
  statusBar: 'dark' as const,
};

export const darkTheme = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  border: '#38383A',
  cardBackground: '#1C1C1E',
  tabBarBackground: '#000000',
  statusBar: 'light' as const,
};

export const getTheme = (mode: ThemeMode) => {
  if (mode === 'system') {
    // This will be handled in components using useColorScheme
    // For now, default to dark for system
    return darkTheme;
  }
  return mode === 'light' ? lightTheme : darkTheme;
};

export const habitColors = [
  // Vibrant Colors
  '#007AFF', // Blue
  '#34C759', // Green
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#5856D6', // Purple
  '#FF2D92', // Pink
  '#5AC8FA', // Light Blue
  '#FFCC00', // Yellow
  '#AF52DE', // Violet
  '#32D74B', // Light Green
  '#FF6482', // Rose
  '#64D2FF', // Cyan
  '#BF5AF2', // Magenta
  '#FF8C00', // Dark Orange
  '#00C7BE', // Teal
  '#1ABC9C', // Turquoise
  
  // Pastel Colors
  '#B8E6B8', // Pastel Green
  '#FFD1DC', // Pastel Pink
  '#E6E6FA', // Pastel Lavender
  '#F0E68C', // Pastel Yellow
  '#FFE4E1', // Pastel Peach
  '#E0E6FF', // Pastel Blue
  '#F5DEB3', // Pastel Wheat
  '#D8BFD8', // Pastel Plum
  '#AFEEEE', // Pastel Turquoise
  '#F0FFF0', // Pastel Mint
  '#FFF8DC', // Pastel Cream
  '#E6F3FF', // Pastel Sky Blue
  
  // Muted Colors
  '#8B9DC3', // Muted Blue
  '#A8C8A8', // Muted Green
  '#D4A5A5', // Muted Rose
  '#C8A696', // Muted Brown
  '#B19CD9', // Muted Purple
  '#FFB6C1', // Muted Light Pink
  '#87CEEB', // Muted Sky Blue
  '#DDA0DD', // Muted Plum
  '#F4A460', // Muted Sandy Brown
  '#98FB98', // Muted Pale Green
  '#F0E68C', // Muted Khaki
  '#FFEFD5', // Muted Papaya Whip
  
  // Dark/Rich Colors
  '#2E4057', // Dark Blue Gray
  '#8B4513', // Saddle Brown
  '#2F4F4F', // Dark Slate Gray
  '#556B2F', // Dark Olive Green
  '#800080', // Purple
  '#B22222', // Fire Brick
  '#191970', // Midnight Blue
  '#8B008B', // Dark Magenta
  '#483D8B', // Dark Slate Blue
  '#2E8B57', // Sea Green
  '#CD853F', // Peru
  '#A0522D', // Sienna
];

// Organized color groups for better UI
export const colorGroups = {
  vibrant: [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500', '#5856D6', '#FF2D92',
    '#5AC8FA', '#FFCC00', '#AF52DE', '#32D74B', '#FF6482', '#64D2FF',
    '#BF5AF2', '#FF8C00', '#00C7BE', '#1ABC9C'
  ],
  pastel: [
    '#B8E6B8', '#FFD1DC', '#E6E6FA', '#F0E68C', '#FFE4E1', '#E0E6FF',
    '#F5DEB3', '#D8BFD8', '#AFEEEE', '#F0FFF0', '#FFF8DC', '#E6F3FF'
  ],
  muted: [
    '#8B9DC3', '#A8C8A8', '#D4A5A5', '#C8A696', '#B19CD9', '#FFB6C1',
    '#87CEEB', '#DDA0DD', '#F4A460', '#98FB98', '#F0E68C', '#FFEFD5'
  ],
  dark: [
    '#2E4057', '#8B4513', '#2F4F4F', '#556B2F', '#800080', '#B22222',
    '#191970', '#8B008B', '#483D8B', '#2E8B57', '#CD853F', '#A0522D'
  ]
};

// Utility function to convert hex to rgba with opacity
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};