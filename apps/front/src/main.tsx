import { createBrowserHistory } from 'history';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import reportWebVitals from '../src/reportWebVitals';

import App from './app/App';
import { Auth0Wrapper } from './auth0';
import { GraphQLProvider } from './graphQL/graphQLProvider';
import { theme } from './styles/theme';

export const history = createBrowserHistory();

ReactDOM.render(
  <Auth0Wrapper>
    <GraphQLProvider>
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </ThemeProvider>
    </GraphQLProvider>
  </Auth0Wrapper>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
