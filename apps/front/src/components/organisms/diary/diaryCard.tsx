import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import styled, { useTheme } from 'styled-components';

import {
  Browser,
  DragItemType,
  THIRTY_MINUTES_TIME,
  TOOLTIP_TIME,
} from '../../../constant';
import {
  DeleteReviewMutationInput,
  DeleteTodoMutationInput,
  GetReviewOutput,
  GetTodoOutput,
  UpdateReviewMutationInput,
  UpdateTodoMutationInput,
} from '../../../graphQL/types';
import { useBrowserInfo } from '../../../hooks';
import { ColorCheckButton, DiaryDeleteModal } from '../../atoms';
import { Tooltip } from '../../atoms/tooltips';

type StyleType = 'drag' | 'none' | 'timeLess';

type StyledDiaryCardWrapperPropTypes = {
  styleType: StyleType;
  height: number;
  left: number;
  top: number;
  parentWidth: number;
  isDragging: boolean;
  isCompleted: boolean;
  isUpdatable: boolean;
  itemType: DragItemType;
};

const StyledDiaryCardWrapper = styled.div<StyledDiaryCardWrapperPropTypes>`
  position: ${({ styleType }) => {
    switch (styleType) {
      case 'timeLess':
        return 'relative';
      case 'drag':
        return null;
      default:
        return 'absolute';
    }
  }};
  top: ${({ top, styleType }) => (styleType === 'timeLess' ? 0 : top)}px;
  left: ${({ left, styleType }) => (styleType === 'timeLess' ? 0 : left)}px;

  width: ${({ parentWidth }) => parentWidth}px;
  height: ${({ height }) => height}px;

  display: ${({ isDragging }) => (isDragging ? 'none' : 'flex')};
  flex-direction: row;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.colors.purple1};
  background-color: ${({ theme, isCompleted, isUpdatable, itemType }) => {
    if (itemType === 'review') {
      return theme.colors.black2;
    }

    return isCompleted
      ? theme.colors.purple3
      : isUpdatable
      ? theme.colors.black2
      : theme.colors.green2;
  }};

  border: 0.5px solid ${({ theme }) => theme.colors.grey3};
  box-sizing: border-box;
`;

const StyledResizingDragBox = styled.div<{ parentWidth: number }>`
  position: absolute;
  width: ${({ parentWidth }) => parentWidth}px;
  height: 5px;
  cursor: ns-resize;
`;

type PropTypes = {
  itemType: DragItemType;
  styleType: StyleType;
  item: GetReviewOutput | GetTodoOutput;
  parentWidth: number;
  height: number;
  today: Date;
  left: number;
  originalIndex?: number;
  setIsCanDrop: (v: boolean) => void;
  isCompleted?: boolean;
  updateItem: (
    input: UpdateTodoMutationInput | UpdateReviewMutationInput,
  ) => void;
  deleteItem: (
    input: DeleteTodoMutationInput | DeleteReviewMutationInput,
  ) => void;
};

export const DiaryCard: FC<PropTypes> = ({
  itemType,
  styleType,
  item,
  originalIndex = 0,
  parentWidth,
  today,
  height,
  left,
  setIsCanDrop,
  isCompleted = false,
  updateItem,
  deleteItem,
}): JSX.Element => {
  const theme = useTheme();
  const { browser } = useBrowserInfo();

  const dragDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [content, setContent] = useState(item.content);

  const isUpdatable = useMemo(() => {
    if (itemType === 'todo') {
      if (item.finishedAt) {
        return Date.now() < item.finishedAt;
      }
    }

    return true;
  }, [item]);

  const showTooltip = () => {
    setIsTooltipOpen(true);
    setTimeout(() => {
      setIsTooltipOpen(false);
    }, TOOLTIP_TIME);
  };

  const onEnterPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isUpdatable) {
      if (e.key === 'Enter' && 0 < content.length) {
        e.preventDefault();
        inputRef.current?.blur();
        updateItem({
          id: item.id,
          content,
        });
      }
    } else {
      showTooltip();
    }
  };

  const onChangeContentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatable) {
      const { value } = e.target;
      setContent(value);
    } else {
      showTooltip();
    }
  };

  const onDeleteItem = () => {
    if (isUpdatable) {
      deleteItem({ id: item.id });
    } else {
      showTooltip();
    }
  };

  const diaryCardRef = useRef<HTMLDivElement>(null);

  const timeToString = (timestamp?: number) => {
    if (!timestamp) {
      return '';
    }

    const date = new Date(timestamp);
    const hour = date.getHours();
    const minute = date.getMinutes();

    const str = `${hour}시`;

    if (minute > 0) {
      return `${str} ${minute}분`;
    }

    return str;
  };

  const getTop = useCallback(
    (startedAt?: number, finishedAt?: number): number => {
      if (!startedAt || !finishedAt) {
        return 60 + originalIndex * 30;
      }

      const year = today.getFullYear();
      const month = today.getMonth();
      const date = today.getDate();

      const zeroTimeToday = +new Date(year, month, date, 0, 0, 0);

      const top =
        Math.floor((startedAt - zeroTimeToday) / THIRTY_MINUTES_TIME) * 30;

      return top;
    },
    [item],
  );

  const { startedAt, finishedAt } = item;
  const startedStr = useMemo(() => timeToString(startedAt), [startedAt]);
  const finishedStr = useMemo(() => timeToString(finishedAt), [finishedAt]);

  const top = getTop(startedAt, finishedAt);

  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: itemType,
    canDrag: isUpdatable,
    item: item,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, resizeTopRef, resizeTopPreview] = useDrag({
    type: 'resize-top',
    canDrag: isUpdatable,
    item: {
      ...item,
      type: itemType,
    },
  });

  const [, resizeBottomRef, resizeBottomPreview] = useDrag({
    type: 'resize-bottom',
    canDrag: isUpdatable,
    item: {
      ...item,
      type: itemType,
    },
  });

  useEffect(() => {
    if (diaryCardRef.current) {
      if (browser.name === Browser.Firefox) {
        dragPreview(getEmptyImage(), { captureDraggingState: true });
      } else {
        dragPreview(diaryCardRef);
      }
      resizeTopPreview(getEmptyImage());
      resizeBottomPreview(getEmptyImage());
    }
  }, [diaryCardRef]);

  useEffect(() => {
    if (dragDivRef.current) {
      dragRef(dragDivRef);
    }
  }, [dragDivRef]);

  return (
    <>
      <StyledDiaryCardWrapper
        ref={diaryCardRef}
        itemType={itemType}
        styleType={styleType}
        height={height}
        top={top}
        left={left}
        parentWidth={parentWidth ?? 0}
        isDragging={isDragging}
        onDragStart={() => {
          if (!isUpdatable) {
            showTooltip();
          }
        }}
        onDragOver={() => {
          setIsCanDrop(false);
        }}
        onDragLeave={() => {
          setIsCanDrop(true);
        }}
        isCompleted={isCompleted}
        isUpdatable={isUpdatable}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsDeletedModalOpen(true);
        }}
      >
        {isTooltipOpen && (
          <Tooltip
            content="시간이 지나 할일 수정이 불가합니다 : ("
            bottom={height < 31 ? -30 : Math.floor(height / 2) - 60}
          />
        )}
        {isDeletedModalOpen && (
          <DiaryDeleteModal
            onClick={() => {
              setIsDeletedModalOpen(false);
            }}
            deleteItem={onDeleteItem}
            parentHeight={height}
          />
        )}
        {styleType === 'none' && (
          <>
            <StyledResizingDragBox
              ref={resizeTopRef}
              parentWidth={parentWidth}
              style={{
                top: 0,
              }}
            />

            <StyledResizingDragBox
              ref={resizeBottomRef}
              parentWidth={parentWidth}
              style={{
                bottom: 0,
              }}
            />
          </>
        )}

        <div
          ref={dragDivRef}
          style={{
            position: 'absolute',
            width: parentWidth * 0.9,
            height: height > 60 ? height * 0.9 : height * 0.7,
            display: 'flex',
            justifySelf: 'center',
            alignSelf: 'center',
            cursor: 'move',
            left: itemType === 'todo' ? 0 : undefined,
          }}
        />

        <div
          ref={contentRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '90%',
            justifyContent: 'center',
            cursor: 'move',
          }}
        >
          {itemType === 'todo' ? (
            <input
              ref={inputRef}
              style={{
                height: 'auto',
                fontSize: 16,
                color: isCompleted
                  ? theme.colors.purple1
                  : isUpdatable
                  ? theme.colors.purple1
                  : theme.colors.green1,
                fontFamily: theme.fonts.spoqaHanSansNeo,
                backgroundColor: 'transparent',
                border: 0,
                outline: 'none',
                zIndex: 1,
              }}
              value={content}
              onKeyPress={onEnterPress}
              onChange={onChangeContentInput}
              onMouseOver={() => {
                if (inputRef.current) {
                  dragRef(inputRef);
                }
              }}
              onMouseLeave={() => {
                if (dragDivRef.current) {
                  dragRef(dragDivRef);
                }
              }}
            />
          ) : (
            <span
              style={{
                height: 'auto',
                fontSize: 16,
                fontFamily: theme.fonts.spoqaHanSansNeo,
              }}
            >
              {content}
            </span>
          )}

          {height > 30 && (
            <span
              style={{
                height: 'auto',
                fontSize: 12,
                fontFamily: theme.fonts.spoqaHanSansNeo,
              }}
            >
              {styleType === 'drag'
                ? '시간 수정 중'
                : `${startedStr} ~ ${finishedStr}`}
            </span>
          )}
        </div>

        {itemType === 'todo' && item.startedAt && item.finishedAt && (
          <ColorCheckButton
            isChecked={isCompleted}
            onClick={(val: boolean) => {
              updateItem({
                id: item.id,
                isCompleted: val,
              });
            }}
          />
        )}
      </StyledDiaryCardWrapper>
    </>
  );
};
