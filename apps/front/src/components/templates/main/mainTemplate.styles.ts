import styled from 'styled-components';

export const StyledMainTemplate = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.black2};
`;

export const StyledBody = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  flex: 1;
  flex-direction: column;

  overflow: hidden;
`;

export const StyledDiaryContainer = styled.div<{ height?: number }>`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex: 1;

  position: relative;

  overflow-y: auto;
  overflow-x: hidden;
`;

export const StyledTime = styled.div<{
  isNowHour: boolean;
  width: number;
  top: number;
}>`
  position: absolute;

  width: ${({ width }) => width}px;
  min-height: ${({ theme }) => theme.sizes.diaryCardHeight}px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme, isNowHour }) =>
    isNowHour ? theme.colors.purple1 : theme.colors.grey1};
  font-family: Spoqa Han Sans Neo;
  font-size: 14px;

  border-right: 0.5px solid ${({ theme }) => theme.colors.grey3};

  top: ${({ top }) => top}px;
`;

export const StyledDiaryTitleContainer = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  min-height: 66px;

  color: ${({ theme }) => theme.colors.purple1};
  font-size: 18;
`;

export const StyledDiaryTitle = styled.div<{ isEmpty: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 70px;
  width: ${({ isEmpty }) => (isEmpty ? null : '100%')};
  height: 100%;

  border: 0.5px solid ${({ theme }) => theme.colors.grey3};
  box-sizing: border-box;
`;

export const StyledTimeUndecidedContainer = styled.div<{
  isTimeUndecidedDiary: boolean;
}>`
  width: 100%;
  min-height: ${({ isTimeUndecidedDiary }) =>
    isTimeUndecidedDiary ? 180 : 0}px;

  display: flex;
  flex-direction: row;
`;

export const StyledTimeUndecided = styled.div<{
  width: number;
}>`
  min-width: ${({ width }) => width}px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 0.5px solid ${({ theme }) => theme.colors.grey3};
  color: ${({ theme }) => theme.colors.purple1};
`;
