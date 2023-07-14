import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

import { ErrorTiry, GoMainButton } from '../../assets/img';
import { ROUTES } from '../../constant';

const StyledNotFoundPageWrapper = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.purple4};
`;

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <StyledNotFoundPageWrapper>
      <span
        style={{
          fontSize: 18,
          color: theme.colors.white1,
        }}
      >
        잘못된 페이지로 들어왔어요 :(
        <br />
        메인화면으로 돌아가볼까요
      </span>
      <ErrorTiry />
      <GoMainButton
        onClick={() => {
          navigate(ROUTES.MAIN);
        }}
      />
    </StyledNotFoundPageWrapper>
  );
};
