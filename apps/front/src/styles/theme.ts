import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const theme = {
  colors: {
    green1: '#58CAB5',
    green2: '#092E27',

    purple1: '#9299FF',
    purple2: '#404DB7',
    purple3: '#16132E',
    purple4: '#080A20',

    grey1: '#BBBBBB',
    grey2: '#999999',
    grey3: '#464646',

    black1: '#242424',
    black2: '#171717',

    white1: '#FFFFFF',
  },
  fonts: {
    spoqaHanSansNeo: 'Spoqa Han Sans Neo',
    kotraHope: 'KOTRAHOPE',
  },
  sizes: {
    diaryCardHeight: 60,
  },
};

export type Theme = typeof theme;

export const useTheme = (): Theme => useContext<Theme>(ThemeContext);
