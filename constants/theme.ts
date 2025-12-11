// src/theme/theme.ts
export type ThemeMode = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  colors: {
    primary: string;
    primarySoft: string;
    background: string;
    backgroundAlt: string;
    card: string;
    cardSoft: string;
    border: string;
    text: string;
    textSoft: string;
    textMuted: string;
    danger: string;
    success: string;
    overlay: string;
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadow: {
    soft: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
};

const base = {
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  shadow: {
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#10B981',        // Verde esmeralda vibrante
    primarySoft: '#D1FAE5',    // Verde suave pastel
    background: '#ffffffff',     // Verde muito claro, quase branco
    backgroundAlt: '#FFFFFF',  // Branco puro
    card: '#FFFFFF',           // Branco puro para cards
    cardSoft: '#ECFDF5',       // Verde clarinho para destaque
    border: '#D1D5DB',         // Cinza neutro
    text: '#065F46',           // Verde escuro para texto principal
    textSoft: '#047857',       // Verde médio para texto secundário
    textMuted: '#6B7280',      // Cinza para texto terciário
    danger: '#EF4444',         // Vermelho para alertas
    success: '#10B981',        // Verde para sucesso (mesmo do primary)
    overlay: 'rgba(6, 95, 70, 0.6)',  // Overlay verde escuro
  },
  ...base,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#34D399',        // Verde menta brilhante
    primarySoft: '#064E3B',    // Verde escuro profundo
    background: '#022C22',     // Verde quase preto
    backgroundAlt: '#0F172A',  // Slate escuro
    card: '#064E3B',           // Verde escuro para cards
    cardSoft: '#065F46',       // Verde escuro médio para destaque
    border: '#1F2937',         // Cinza escuro neutro
    text: '#ECFDF5',           // Verde clarinho para texto
    textSoft: '#A7F3D0',       // Verde claro para secundário
    textMuted: '#9CA3AF',      // Cinza para terciário
    danger: '#F87171',         // Vermelho suave
    success: '#34D399',        // Verde menta (mesmo do primary)
    overlay: 'rgba(2, 44, 34, 0.85)',  // Overlay verde muito escuro
  },
  ...base,
};