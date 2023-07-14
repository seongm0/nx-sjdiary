import { CSSProperties, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

import CheckBoxButtonImg from '../../../assets/img/check_box_button.png';

type ButtonColorType = 'green2' | 'purple1';

type StyledProps = {
  buttonColor: ButtonColorType;
};

const StyledColorCheckButton = styled.button<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ buttonColor, theme }) => theme.colors[buttonColor]};

  border-radius: 3px;
  border: 0px;
`;

type PropTypes = {
  buttonColor?: ButtonColorType;
  isChecked?: boolean;
  onClick: (val: boolean) => void;
};

export const ColorCheckButton = ({
  buttonColor = 'purple1',
  isChecked = false,
  onClick,
}: PropTypes) => {
  const { colors } = useTheme();

  const backgroundColor = useMemo(() => {
    return buttonColor === 'purple1' ? colors.black2 : colors.green2;
  }, [buttonColor]);

  const duplicateStyles: CSSProperties = {
    width: 18,
    height: 18,
    marginLeft: 4,
    cursor: 'pointer',
  };

  return isChecked ? (
    <img
      src={CheckBoxButtonImg}
      style={{
        ...duplicateStyles,
        backgroundColor,
      }}
      onClick={() => onClick(!isChecked)}
    />
  ) : (
    <StyledColorCheckButton
      buttonColor={buttonColor}
      style={duplicateStyles}
      onClick={() => onClick(!isChecked)}
    >
      <div
        style={{
          minWidth: 12,
          minHeight: 12,
          backgroundColor,
        }}
      />
    </StyledColorCheckButton>
  );
};
