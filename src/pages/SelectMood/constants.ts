export const Moods = {
  ANXIETY: '불안',
  DEPRESSION: '우울',
  ANGER: '화남',
  JOY: '기쁨',
  SIMPLICITY: '소소함',
  ANTICIPATION: '기대',
  LONELINESS: '외로움',
  DETACHMENT: '초연함',
  LONGING: '그리움',
} as const;
export type Mood = (typeof Moods)[keyof typeof Moods];

export const MoodColors = {
  [Moods.ANXIETY]: '#FFE3E3',
  [Moods.DEPRESSION]: '#D6E0F0',
  [Moods.ANGER]: '#FFD6D6',
  [Moods.JOY]: '#FFF3B0',
  [Moods.SIMPLICITY]: '#F2F2F2',
  [Moods.ANTICIPATION]: '#E0F7FA',
  [Moods.LONELINESS]: '#E8EAF6',
  [Moods.DETACHMENT]: '#F0F4C3',
  [Moods.LONGING]: '#FCE4EC',
} as const;
