import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import { REACT_APP_MODE } from '../config';
import { MainRouter } from '../mainRouter';
import { GlobalStyle } from '../styles/globalStyles';

import { AppDebug } from './AppDebug';

const AppWrapper = styled.div`
  width: 60%;
  max-width: 861px;
  height: 100vh;

  display: flex;

  background-color: ${({ theme }) => theme.colors.purple4};
`;

const App = () => {
  return (
    <>
      <AppWrapper>
        <BrowserRouter>
          <GlobalStyle />
          <MainRouter />
        </BrowserRouter>
      </AppWrapper>
      {REACT_APP_MODE === 'local' && <AppDebug />}
    </>
  );
};

export default App;
