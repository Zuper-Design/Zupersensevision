import { createContext, useContext } from 'react';

export interface RadarThemeConfig {
  name: string;
  // Page
  pageBg: string;
  headerBg: string;
  headerBorder: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  cardRadius: string;
  cardShadow: string;
  cardHoverShadow: string;
  // Typography
  fontFamily: string;
  titleColor: string;
  subtitleColor: string;
  valueColor: string;
  dividerColor: string;
  // Accent
  accentColor: string;
  accentBg: string;
  // Section labels
  labelColor: string;
  // Buttons / badges
  badgeBg: string;
  badgeColor: string;
  controlBg: string;
  controlColor: string;
  controlHoverBg: string;
  // Stat row
  statBg: string;
}

export const RADAR_THEMES: Record<string, RadarThemeConfig> = {
  clean: {
    name: 'Clean',
    pageBg: '#FFFFFF',
    headerBg: '#FFFFFF',
    headerBorder: '#E6E8EC',
    cardBg: '#FFFFFF',
    cardBorder: '1px solid #E6E8EC',
    cardRadius: '12px',
    cardShadow: '0 1px 3px rgba(0,0,0,0.04)',
    cardHoverShadow: '0 4px 16px rgba(0,0,0,0.08)',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    titleColor: '#1C1E21',
    subtitleColor: '#6B7280',
    valueColor: '#1C1E21',
    dividerColor: '#F0F0F0',
    accentColor: '#FD5000',
    accentBg: '#FFF4ED',
    labelColor: '#9CA3AF',
    badgeBg: '#FFF4ED',
    badgeColor: '#FD5000',
    controlBg: '#F3F4F6',
    controlColor: '#6B7280',
    controlHoverBg: '#E5E7EB',
    statBg: 'transparent',
  },

  rams: {
    name: 'Rams',
    // Warm Braun-cream page, pure white cards — the exact palette of a 1960s Braun SK4
    pageBg: '#E8E2D6',
    headerBg: '#F5F2EC',
    headerBorder: '#0A0A0A',
    cardBg: '#F8F5F0',
    cardBorder: '1.5px solid #0A0A0A',
    cardRadius: '0px',
    cardShadow: 'none',
    // Offset shadow — no blur, pure geometry like a Braun product casting a hard shadow
    cardHoverShadow: '5px 5px 0px #0A0A0A',
    // Helvetica Neue: the typeface that defines Braun's design language
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    titleColor: '#0A0A0A',
    subtitleColor: '#5A5A5A',
    // Values in Braun yellow — the single pop of colour on an otherwise monochrome palette
    valueColor: '#0A0A0A',
    dividerColor: '#0A0A0A',
    // Braun yellow: #E8D000 — used sparingly on the SK series dials and ET44 calculator
    accentColor: '#C8A800',
    accentBg: '#FBF6DC',
    labelColor: '#5A5A5A',
    badgeBg: '#0A0A0A',
    badgeColor: '#F8F5F0',
    controlBg: '#DDD8CE',
    controlColor: '#0A0A0A',
    controlHoverBg: '#C8C4BA',
    statBg: '#EDE8E0',
  },

  neon: {
    name: 'Neon',
    // Near-void black — like a CRT screen powered off
    pageBg: '#06060F',
    headerBg: '#0A0A1C',
    headerBorder: '#1E1E4A',
    // Cards: deep navy with a faint electric edge
    cardBg: '#0D0D24',
    cardBorder: '1px solid #2A2A6A',
    cardRadius: '8px',
    // Glow shadow: electric violet bloom
    cardShadow: '0 0 0 1px #1E1E4A, 0 4px 24px rgba(120,60,255,0.12)',
    cardHoverShadow: '0 0 0 1px #7B3FFF, 0 0 32px rgba(123,63,255,0.35)',
    // Space Mono: the font of terminals, dashboards, mission control
    fontFamily: '"Space Mono", "Courier New", monospace',
    titleColor: '#E4E0FF',
    subtitleColor: '#7070C0',
    // Values in electric magenta
    valueColor: '#D060FF',
    dividerColor: '#1E1E4A',
    // Electric violet as primary accent
    accentColor: '#7B3FFF',
    accentBg: 'rgba(123,63,255,0.15)',
    // Labels in neon cyan — second accent colour
    labelColor: '#00EEFF',
    badgeBg: 'rgba(0,238,255,0.12)',
    badgeColor: '#00EEFF',
    controlBg: '#141434',
    controlColor: '#9090D0',
    controlHoverBg: '#1E1E50',
    statBg: '#0A0A20',
  },
};

export const RadarThemeContext = createContext<RadarThemeConfig>(RADAR_THEMES.clean);

export function useRadarTheme() {
  return useContext(RadarThemeContext);
}
