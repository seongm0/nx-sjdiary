import styled, { useTheme } from 'styled-components';

import { LeftArrowButton, RightArrowButton } from '../../../assets/img';
import { GetMeOutput } from '../../../graphQL/types';
import { getWeek } from '../../../utils';

const StyledHeaderWrapper = styled.header`
  width: 100%;
  height: 10%;
  min-height: 90px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledLeftHeader = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-left: 10px;
`;

const StyledRightHeader = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-right: 40px;
`;

const StyledTodayButton = styled.button`
  margin: 3px 0px 0px 10px;

  width: 48px;
  height: 31px;

  border: 0.5px solid ${({ theme }) => theme.colors.grey3};
  border-radius: 4px;
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.colors.black2};

  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey1};

  cursor: pointer;
`;

type PropTypes = {
  dataMe?: GetMeOutput;
  today: Date;
  setToday: React.Dispatch<React.SetStateAction<Date>>;
};

export const MainHeader = ({
  dataMe,
  today,
  setToday,
}: PropTypes): JSX.Element => {
  const theme = useTheme();

  const month = today.getMonth() + 1;
  const week = getWeek(today);

  const onClickUpdateToday = (type: 'left' | 'right') => {
    const date = today.getDate();
    const newDate = new Date(today);
    if (type === 'left') {
      newDate.setDate(date - 7);
    } else {
      newDate.setDate(date + 7);
    }

    setToday(newDate);
    localStorage.setItem('today', newDate.toISOString());
  };

  return (
    <StyledHeaderWrapper>
      <StyledLeftHeader>
        <LeftArrowButton
          style={{
            cursor: 'pointer',
            marginTop: 3,
          }}
          onClick={() => {
            onClickUpdateToday('left');
          }}
        />
        <span
          style={{
            fontSize: 30,
            color: theme.colors.white1,
            cursor: 'pointer',
          }}
        >
          {month}월 {week}째주
        </span>
        <RightArrowButton
          style={{
            cursor: 'pointer',
            marginTop: 3,
          }}
          onClick={() => {
            onClickUpdateToday('right');
          }}
        />
        <StyledTodayButton
          onClick={() => {
            setToday(new Date());
            localStorage.setItem('today', new Date().toISOString());
          }}
        >
          오늘
        </StyledTodayButton>
      </StyledLeftHeader>
      <StyledRightHeader>
        <span
          style={{
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: 18,
            color: theme.colors.purple1,
            marginRight: 16,
          }}
        >
          오늘의 도달률 0%
        </span>
        <img
          style={{
            display: 'table-cell',
            width: 40,
            height: 40,
            borderRadius: 100,
          }}
          src={dataMe?.profileImageUrl}
          alt="프로필사진"
        />
      </StyledRightHeader>
    </StyledHeaderWrapper>
  );
};
