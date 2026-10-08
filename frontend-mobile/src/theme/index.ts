// src/theme/colors.ts
export const colors = {
  // Palet Inti
  primaryDark: '#074173',
  primary: '#1679AB',
  accentTeal: '#5DEBD7',
  accentLime: '#C5FF95',

  // Warna Netral
  bgBase: '#F7FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0B2436',
  textSecondary: '#5C7A91',
  border: '#DCE8F0',
  disabled: '#B8C5CE',
  white: '#FFFFFF',

  // Warna Semantik[cite: 1]
  success: '#2FAE60',
  danger: '#D64545',
  warning: '#E3A008',
};

// src/theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 20,  // ← sudah ada di kamu
  cardGap: 12,        // ← TAMBAHKAN INI (DESIGN.md §4)
} as const;

// src/theme/typography.ts
export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Poppins_600SemiBold',  // ← harus ada
  },
  h1: { fontSize: 22, lineHeight: 30, fontFamily: 'Poppins_600SemiBold' },
  h2: { fontSize: 18, lineHeight: 26, fontFamily: 'Poppins_600SemiBold' },
  body: { fontSize: 15, lineHeight: 22, fontFamily: 'Poppins_400Regular' },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontFamily: 'Poppins_500Medium' },
  button: { fontSize: 16, lineHeight: 20, fontFamily: 'Poppins_600SemiBold' },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: 'Poppins_400Regular' },
  label: { fontSize: 12, lineHeight: 16, fontFamily: 'Poppins_500Medium' },
};

// src/theme/radius.ts
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};