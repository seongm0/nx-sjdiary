import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const StyledDiaryDeleteModal = styled.div<{ parentHeight: number }>`
  position: absolute;

  width: 30%;
  height: ${({ parentHeight }) => parentHeight}px;
  right: 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.black2};
  box-shadow: 5px 5px 10px #000000;

  z-index: 2;

  cursor: pointer;
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.colors.grey1};
`;

type PropTypes = {
  onClick: () => void;
  deleteItem: () => void;
  parentHeight: number;
};

export const DiaryDeleteModal = ({
  onClick,
  deleteItem,
  parentHeight,
}: PropTypes) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (e.target) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClick();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <StyledDiaryDeleteModal
      onClick={() => deleteItem()}
      ref={ref}
      parentHeight={parentHeight}
    >
      <StyledSpan>삭제하기</StyledSpan>
    </StyledDiaryDeleteModal>
  );
};
