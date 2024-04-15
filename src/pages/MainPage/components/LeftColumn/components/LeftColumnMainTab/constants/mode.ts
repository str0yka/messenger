export const MODE = {
  CHAT_LIST: 'CHAT_LIST',
  SEARCH_LIST: 'SEARCH_LIST',
} as const;

export type Mode = (typeof MODE)[keyof typeof MODE];
