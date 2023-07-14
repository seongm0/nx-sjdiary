import { useEffect } from 'react';
import styled from 'styled-components';

const StyledTooltip = styled.div<{ bottom?: number }>`
  width: auto;
  height: 40px;

  position: absolute;

  left: 10px;
  bottom: ${({ bottom }) => (bottom !== undefined ? `${bottom}px` : undefined)};

  z-index: 1;
`;

const Triangle = styled.div`
  width: 0px;
  height: 0px;
  border-bottom: calc(10px * 1.732) solid ${({ theme }) => theme.colors.grey3};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;

  margin: 0px 0px 0px 10px;
`;

const StyledTextBox = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.grey3};
`;

const StyledP = styled.p`
  font-family: KOTRA HOPE;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white1};

  margin: 0px 10px 0px 7px;
`;

type PropTypes = {
  content: string;
  bottom?: number;
};

export const Tooltip = ({ content, bottom }: PropTypes) => {
  return (
    <StyledTooltip bottom={bottom}>
      <Triangle />
      <StyledTextBox>
        <StyledP>{content}</StyledP>
      </StyledTextBox>
    </StyledTooltip>
  );
};
