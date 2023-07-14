import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import styled, { useTheme } from 'styled-components';

import { content_MAX_LENGTH, DragItemType } from '../../../constant';
import {
  CreateReviewMutationInput,
  CreateTodoMutationInput,
} from '../../../graphQL/types';

const StyledDiaryCreateCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  max-height: 60px;
  min-height: 60px;

  border: 0.5px solid ${({ theme }) => theme.colors.grey3};
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.colors.black1};
`;

type PropTypes = {
  inputPlaceHolder: string;
  dragItemType: DragItemType;
  createDiary: (
    input: CreateTodoMutationInput | CreateReviewMutationInput,
    options?: { setContent: () => void },
  ) => void;
};

export const DiaryCreateCard = ({
  inputPlaceHolder,
  dragItemType,
  createDiary,
}: PropTypes) => {
  const theme = useTheme();

  const [content, setContent] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);

  const onEnterPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && 0 < content.length) {
      await createDiary(
        {
          content,
        },
        {
          setContent: () => {
            setContent('');
          },
        },
      );
    }
  };

  const onChangeContentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setContent(value);
  };

  const customCanDarg = useCallback(() => {
    const isCanDarg = content.length > 0;

    if (!isCanDarg) {
      const msg =
        dragItemType === 'todo'
          ? '할일을 입력해주세요'
          : '했던 일을 입력해주세요';
      alert(msg);
    }

    return isCanDarg;
  }, [content]);

  const [, drag, dragPreview] = useDrag({
    type: dragItemType,
    item: () => ({
      content,
      setContent,
    }),
    canDrag: customCanDarg,
  });

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  useEffect(() => {
    drag(wrapperRef);
  }, [wrapperRef]);

  return (
    <StyledDiaryCreateCardWrapper ref={wrapperRef}>
      <input
        style={{
          width: '90%',
          fontSize: 16,
          color: content.length > 0 ? theme.colors.white1 : theme.colors.grey2,
          backgroundColor: 'transparent',
          border: 'none',
          outlineStyle: 'none',
        }}
        maxLength={content_MAX_LENGTH}
        type="text"
        value={content}
        onChange={onChangeContentInput}
        placeholder={inputPlaceHolder}
        onKeyPress={onEnterPress}
      />
      <span
        style={{
          width: '90%',
          fontSize: 12,
          fontFamily: theme.fonts.spoqaHanSansNeo,
          color: theme.colors.grey1,
          marginTop: 2,
        }}
      >
        드래그해서 시간을 설정해주세요.
      </span>
    </StyledDiaryCreateCardWrapper>
  );
};
