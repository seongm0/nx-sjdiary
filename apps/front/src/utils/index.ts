import { THIRTY_MINUTES_TIME } from '../constant';

export const getTodayZeroTimeTimestamp = (): number => {
  const todayDate = new Date();
  return +new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate(),
    0,
    0,
    0,
  );
};

export const convertToDate = (dateObj: Date) => {
  const year = dateObj.getFullYear();
  const month =
    dateObj.getMonth() + 1 >= 10
      ? `${dateObj.getMonth() + 1}`
      : `0${dateObj.getMonth() + 1}`;

  const date =
    dateObj.getDate() >= 10
      ? dateObj.getDate().toString()
      : `0${dateObj.getDate()}`;

  const day = dateObj.getDay();

  const hour =
    dateObj.getHours() >= 10
      ? dateObj.getHours().toString()
      : `0${dateObj.getHours()}`;

  const minute =
    dateObj.getMinutes() >= 10
      ? dateObj.getMinutes().toString()
      : `0${dateObj.getMinutes()}`;

  return {
    year,
    month,
    date,
    day,
    hour,
    minute,
  };
};

// 주차의 시작은 월요일
export const getWeek = (date = new Date()): number => {
  // 월 첫날의 요일
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // 둘째주의 시작 날짜
  const startSecondsWeekDate = firstDay === 0 ? 9 : 9 - firstDay;

  // 오늘
  const nowDate = date.getDate();

  if (nowDate < startSecondsWeekDate) {
    return 1;
  }

  let week = 1;
  let tempDate = startSecondsWeekDate;
  for (let i = 0; i <= 7; i++) {
    week++;
    tempDate += 7;

    if (nowDate < tempDate) {
      break;
    }
  }

  return week;
};

export const getDiaryCardHeight = (startedAt?: number, finishedAt?: number) => {
  if (!startedAt || !finishedAt) {
    return 30;
  }

  return Math.floor((finishedAt - startedAt) / THIRTY_MINUTES_TIME) * 30;
};
