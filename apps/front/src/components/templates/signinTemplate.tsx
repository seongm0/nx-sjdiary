import styled, { useTheme } from 'styled-components';

import { GoogleLoginButton, LoginTiry } from '../../assets/img';
import { SignInOptions } from '../../auth0';

const StyledSignInWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

type PropTypes = {
  signIn: (o: SignInOptions) => void;
};

export const SigninTemplate = ({ signIn }: PropTypes): JSX.Element => {
  const theme = useTheme();

  return (
    <StyledSignInWrapper>
      <div>
        <span
          style={{
            fontSize: 36,
            color: theme.colors.purple1,
          }}
        >
          나의
        </span>
        <span
          style={{
            fontSize: 70,
            color: theme.colors.white1,
          }}
        >
          성장일기
        </span>
      </div>
      <span
        style={{
          fontSize: 18,
          color: theme.colors.purple1,
        }}
      >
        내가 짰던 계획표와 실제 한 일을 비교해 보세요 : )
      </span>
      <LoginTiry
        style={{
          marginTop: 42,
        }}
      />
      <GoogleLoginButton
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          signIn({ type: 'google' });
        }}
      />
    </StyledSignInWrapper>
  );
};
