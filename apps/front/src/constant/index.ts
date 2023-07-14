export * from './routes';

type KoreanDay = '일' | '월' | '화' | '수' | '목' | '금' | '토';

export const DAYS: KoreanDay[] = ['일', '월', '화', '수', '목', '금', '토'];

export const content_MAX_LENGTH = 23;

export type DragType = 'todo' | 'review';

export const THIRTY_MINUTES_TIME = 1800000;
export const ONE_MINUTES_TIME = 60000;

export type DragItemType = 'todo' | 'review';

export enum Browser {
  Firefox = 'Firefox',
  Chrome = 'Chrome',
  Safari = 'Safari',
}

export const TOOLTIP_TIME = 5000;
