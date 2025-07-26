export const Moods = {
  JOY: '기쁨',
  SADNESS: '슬픔',
  ANGER: '분노',
  ANXIETY: '불안',
  EXCITEMENT: '설렘',
  COMFORT: '위로',
  LONELINESS: '외로움',
  INSPIRATION: '감동',
  HAPPINESS: '행복',
} as const;
export type Mood = (typeof Moods)[keyof typeof Moods];

export const MoodColors = {
  [Moods.JOY]: '#FFF4B1', // 기쁨: 따뜻한 연노랑
  [Moods.SADNESS]: '#C9D6FF', // 슬픔: 차가운 연파랑
  [Moods.ANGER]: '#FFB3B3', // 분노: 연한 분홍빛 빨강
  [Moods.ANXIETY]: '#FFD6A5', // 불안: 노란빛이 감도는 연주황
  [Moods.EXCITEMENT]: '#FFD1DC', // 설렘: 상큼한 핑크
  [Moods.COMFORT]: '#D1F7C4', // 위로: 부드러운 민트-연두
  [Moods.LONELINESS]: '#D3C6F3', // 외로움: 흐릿한 보라
  [Moods.INSPIRATION]: '#F6E6B4', // 감동: 따뜻한 베이지/금빛
  [Moods.HAPPINESS]: '#FDEFB2', // 행복: 밝고 포근한 연노랑
} as const;

export const MoodKeys = {
  [Moods.JOY]: 'JOY',
  [Moods.SADNESS]: 'SADNESS',
  [Moods.ANGER]: 'ANGER',
  [Moods.ANXIETY]: 'ANXIETY',
  [Moods.EXCITEMENT]: 'EXCITEMENT',
  [Moods.COMFORT]: 'COMFORT',
  [Moods.LONELINESS]: 'LONELINESS',
  [Moods.INSPIRATION]: 'INSPIRATION',
  [Moods.HAPPINESS]: 'HAPPINESS',
} as const;
