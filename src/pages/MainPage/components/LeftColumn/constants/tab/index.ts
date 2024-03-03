export const TAB = {
  MAIN: 'main',
  SETTINGS: 'settings',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const TAB_ORDER: Record<(typeof TAB)[keyof typeof TAB], number> = {
  [TAB.MAIN]: 1,
  [TAB.SETTINGS]: 2,
  [TAB.LANGUAGE]: 3,
  [TAB.THEME]: 3,
};

export const TABS = Object.values(TAB);
