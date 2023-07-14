import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useTheme } from 'styled-components';

import { Browser, DragItemType, THIRTY_MINUTES_TIME } from '../../../constant';
import {
  CreateReviewMutationInput,
  CreateTodoMutationInput,
  DeleteReviewMutationInput,
  DeleteTodoMutationInput,
  GetMeOutput,
  GetReviewOutput,
  GetReviewsOutput,
  GetTodoOutput,
  GetTodosOutput,
  UpdateReviewMutationInput,
  UpdateTodoMutationInput,
} from '../../../graphQL/types';
import { useBrowserInfo, useWindowSize } from '../../../hooks';
import { getDiaryCardHeight } from '../../../utils';
import { DiaryCardDragLayer } from '../../molecules';
import {
  DiaryCard,
  DiaryCreateCard,
  MainHeader,
  WeekCalendar,
} from '../../organisms';

import {
  StyledBody,
  StyledDiaryContainer,
  StyledDiaryTitle,
  StyledDiaryTitleContainer,
  StyledMainTemplate,
  StyledTime,
  StyledTimeUndecided,
  StyledTimeUndecidedContainer,
} from './mainTemplate.styles';

type PropTypes = {
  dataMe?: GetMeOutput;
  today: Date;
  dataTodos?: GetTodosOutput;
  dataReviews?: GetReviewsOutput;
  setToday: React.Dispatch<React.SetStateAction<Date>>;
  createTodo: (input: CreateTodoMutationInput) => Promise<void>;
  createReview: (input: CreateReviewMutationInput) => Promise<void>;
  updateTodo: (input: UpdateTodoMutationInput) => Promise<void>;
  updateReview: (input: UpdateReviewMutationInput) => Promise<void>;
  deleteTodo: (input: DeleteTodoMutationInput) => Promise<void>;
  deleteReview: (input: DeleteReviewMutationInput) => Promise<void>;
};

export const MainTemplate: FC<PropTypes> = ({
  dataMe,
  today,
  dataTodos,
  dataReviews,
  setToday,
  createTodo,
  createReview,
  updateTodo,
  updateReview,
  deleteTodo,
  deleteReview,
}): JSX.Element => {
  const theme = useTheme();
  const windowSize = useWindowSize();
  const { browser } = useBrowserInfo();

  const nowHour = today.getHours();

  const [isCanDrop, setIsCanDrop] = useState(true);
  const [isScrollSave, setScrollSave] = useState(false);
  const [resizingCard, setResizingItem] = useState<
    | { type: 'todo' | 'review'; item: GetTodoOutput | GetReviewOutput }
    | undefined
  >(undefined);

  const todoTitleRef = useRef<HTMLDivElement>(null);
  const timeTitleRef = useRef<HTMLDivElement>(null);
  const diaryContainerRef = useRef<HTMLDivElement>(null);

  const [diaryContainerStartedY, setDiaryContainerStartedY] = useState(0);
  const [diaryCardWidth, setDiaryCardWidth] = useState(0);
  const [timeCardWidth, setTimeCardWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const isTimeUndecidedTodos = useMemo(
    () =>
      (dataTodos?.timeUndecidedTodos &&
        dataTodos.timeUndecidedTodos.length > 0) ??
      false,
    [dataTodos],
  );
  const isTimeUndecidedReviews = useMemo(
    () =>
      (dataReviews?.timeUndecidedReviews &&
        dataReviews.timeUndecidedReviews.length > 0) ??
      false,
    [dataReviews],
  );
  const isTimeUndecidedDiary = useMemo(
    () => isTimeUndecidedTodos || isTimeUndecidedReviews,
    [dataTodos, dataReviews],
  );

  const getNewTime = (y: number) => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    const todayZeroHourTimestamp = new Date(year, month, date).getTime();

    const calcCurrentY = Math.floor(y - (y % 10));
    const calcScrollTop = Math.floor(scrollTop - (scrollTop % 10));
    const calcDiaryContainerStartedY = Math.floor(
      diaryContainerStartedY - (diaryContainerStartedY % 10),
    );

    const calcY = calcCurrentY + calcScrollTop - calcDiaryContainerStartedY;

    let time = todayZeroHourTimestamp;

    if (calcY < 0) {
      return time;
    }

    time += Math.floor(calcY / 30) * THIRTY_MINUTES_TIME;

    return time;
  };

  const [, todoDrop] = useDrop({
    accept: 'todo',
    canDrop: () => isCanDrop,
    drop: (
      item: GetTodoOutput & { id?: number; setContent: (v: string) => void },
      monitor: DropTargetMonitor,
    ) => {
      const currentOffset = monitor.getSourceClientOffset() as {
        x: number;
        y: number;
      };

      const startedAt = getNewTime(currentOffset.y);

      if (startedAt === item.startedAt) {
        return;
      } else if (item.id) {
        let finishedAt = startedAt;
        if (item.startedAt && item.finishedAt) {
          finishedAt += item.finishedAt - item.startedAt;
        } else {
          finishedAt += THIRTY_MINUTES_TIME;
        }

        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        const nextDayZeroHourTimestamp = new Date(
          year,
          month,
          date + 1,
        ).getTime();

        if (nextDayZeroHourTimestamp < finishedAt) {
          finishedAt = nextDayZeroHourTimestamp;
        }

        const duplicateTodo = dataTodos?.todos.find((todo) => {
          if (todo.startedAt && todo.finishedAt && todo.id !== item.id) {
            if (
              (todo.startedAt < startedAt && todo.finishedAt > startedAt) ||
              (todo.startedAt < finishedAt && todo.finishedAt > finishedAt)
            ) {
              return true;
            }
          }

          return false;
        });

        if (duplicateTodo) {
          return;
        }

        updateTodo({
          id: item.id,
          startedAt,
          finishedAt,
        });
      } else {
        const finishedAt = startedAt + THIRTY_MINUTES_TIME;

        createTodo({
          content: item.content,
          startedAt,
          finishedAt,
        });
        item.setContent('');
      }
    },
  });

  const [, reviewDrop] = useDrop({
    accept: 'review',
    canDrop: () => isCanDrop,
    drop: (
      item: GetReviewOutput & { id?: number },
      monitor: DropTargetMonitor,
    ) => {
      const currentOffset = monitor.getSourceClientOffset() as {
        x: number;
        y: number;
      };

      const startedAt = getNewTime(currentOffset.y);

      if (startedAt === item.startedAt) {
        return;
      } else if (item.id) {
        let finishedAt = startedAt;
        if (item.startedAt && item.finishedAt) {
          finishedAt += item.finishedAt - item.startedAt;
        } else {
          finishedAt += THIRTY_MINUTES_TIME * 2;
        }

        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        const nextDayZeroHourTimestamp = new Date(
          year,
          month,
          date + 1,
        ).getTime();

        if (nextDayZeroHourTimestamp < finishedAt) {
          finishedAt = nextDayZeroHourTimestamp;
        }

        updateReview({
          id: Number(item.id),
          startedAt,
          finishedAt,
        });
      } else {
        const finishedAt = startedAt + THIRTY_MINUTES_TIME * 2;
        createReview({
          content: item.content,
          startedAt,
          finishedAt,
        });
      }
    },
  });

  const getIsCanResize = useCallback(
    ({
      id,
      itemType,
      resizeType,
      newTime,
    }: {
      id: number;
      itemType: 'todo' | 'review';
      resizeType: 'top' | 'bottom';
      newTime: number;
    }): {
      isCanResize: boolean;
      prevItem?: GetTodoOutput | GetReviewOutput;
      nextItem?: GetTodoOutput | GetReviewOutput;
    } => {
      const failObj = {
        isCanResize: false,
      };
      const items =
        itemType === 'todo' ? dataTodos?.todos : dataReviews?.reviews;

      if (!items || items.length < 1) {
        return failObj;
      }

      const item = items?.find((im) => im.id === id);

      if (!item) {
        return failObj;
      } else {
        if (resizeType === 'top') {
          if (item.finishedAt! <= newTime) {
            return failObj;
          }
        } else {
          if (item.startedAt! >= newTime) {
            return failObj;
          }
        }
      }

      let prevItemId = -1;
      let prevItemDiffTime = Number.MAX_SAFE_INTEGER;
      let nextItemId = -1;
      let nextItemDiffTime = Number.MAX_SAFE_INTEGER;

      for (const im of items) {
        // 이전 아이템 찾기
        const prevDiffTime = item.startedAt! - im.finishedAt!;
        if (
          0 < prevDiffTime &&
          prevDiffTime < prevItemDiffTime &&
          im.id !== item.id
        ) {
          prevItemId = im.id;
          prevItemDiffTime = prevDiffTime;
        }

        // 다음 아이템 찾기
        const nextDiffTime = im.startedAt! - item.finishedAt!;
        if (
          0 < nextDiffTime &&
          nextDiffTime < nextItemDiffTime &&
          im.id !== item.id
        ) {
          nextItemId = im.id;
          nextItemDiffTime = nextDiffTime;
        }
      }

      const prevItem = items.find((im) => im.id === prevItemId);
      const nextItem = items.find((im) => im.id === nextItemId);

      let isCanPrev = false;
      let isCanNext = false;

      if (
        !prevItem ||
        (prevItem.finishedAt &&
          prevItem.finishedAt <= newTime &&
          item.finishedAt &&
          item.finishedAt > newTime)
      ) {
        isCanPrev = true;
      }

      if (
        !nextItem ||
        (nextItem.startedAt &&
          nextItem.startedAt >= newTime &&
          item.startedAt &&
          item.startedAt < newTime)
      ) {
        isCanNext = true;
      }

      return {
        isCanResize: resizeType === 'top' ? isCanPrev : isCanNext,
        prevItem,
        nextItem,
      };
    },
    [dataTodos, dataReviews],
  );

  const resizingHover = (
    item: (GetTodoOutput | GetReviewOutput) & { type: DragItemType },
    monitor: DropTargetMonitor,
    itemKey: 'startedAt' | 'finishedAt',
  ) => {
    const { y: diffY } = monitor.getDifferenceFromInitialOffset() as {
      x: number;
      y: number;
    };

    if (diffY === 0) return;

    const { y: clientY } = monitor.getClientOffset() as {
      x: number;
      y: number;
    };

    const newTime = getNewTime(clientY);

    const { isCanResize } = getIsCanResize({
      id: item.id,
      itemType: item.type,
      resizeType: itemKey === 'startedAt' ? 'top' : 'bottom',
      newTime,
    });

    if (isCanResize) {
      item[itemKey] = newTime;
      setResizingItem({
        type: item.type,
        item: { ...item },
      });
    }
  };

  const resizingDrop = (
    item: (GetTodoOutput | GetReviewOutput) & { type: DragItemType },
    monitor: DropTargetMonitor,
    itemKey: 'startedAt' | 'finishedAt',
  ) => {
    const { y: diffY } = monitor.getDifferenceFromInitialOffset() as {
      x: number;
      y: number;
    };
    if (diffY === 0) return;

    const { y } = monitor.getClientOffset() as {
      x: number;
      y: number;
    };

    const newTime = getNewTime(y);

    setIsCanDrop(true);

    const { isCanResize, prevItem, nextItem } = getIsCanResize({
      id: item.id,
      itemType: item.type,
      resizeType: itemKey === 'startedAt' ? 'top' : 'bottom',
      newTime,
    });

    setResizingItem(undefined);

    if (isCanResize) {
      const updatedInput = {
        id: item.id,
        [itemKey]: newTime,
      };
      if (item.type === 'todo') {
        updateTodo(updatedInput);
      } else {
        updateReview(updatedInput);
      }
    } else {
      const updatedInput: UpdateTodoMutationInput | UpdateReviewMutationInput =
        {
          id: item.id,
        };

      let isOverflowThisCard = false;
      if (itemKey === 'startedAt') {
        isOverflowThisCard = item.finishedAt! <= newTime;
      } else {
        isOverflowThisCard = newTime <= item.startedAt!;
      }

      if (isOverflowThisCard) {
        // 시작시간이 종료시간을 넘어간 경우 || 종료시간이 시작시간을 넘어간 경우
        if (itemKey === 'startedAt') {
          updatedInput.startedAt = item.finishedAt! - THIRTY_MINUTES_TIME;
        } else {
          updatedInput.finishedAt = item.startedAt! + THIRTY_MINUTES_TIME;
        }
      } else {
        // 시작 또는 종료시간이 다른 카드를 넘어간 경우
        if (itemKey === 'startedAt') {
          updatedInput.startedAt = prevItem?.finishedAt;
        } else {
          updatedInput.finishedAt = nextItem?.startedAt;
        }
      }

      if (item.type === 'todo') {
        updateTodo(updatedInput);
      } else {
        updateReview(updatedInput);
      }
    }
  };

  const [{ isTopResizing }, resizeTopDropRef] = useDrop({
    accept: 'resize-top',
    canDrop: () => true,
    collect: (monitor) => ({
      isTopResizing: monitor.getItemType() === 'resize-top',
    }),
    hover: (
      item: (GetTodoOutput | GetReviewOutput) & { type: DragItemType },
      monitor: DropTargetMonitor,
    ) => resizingHover(item, monitor, 'startedAt'),
    drop: (
      item: (GetTodoOutput | GetReviewOutput) & { type: DragItemType },
      monitor: DropTargetMonitor,
    ) => resizingDrop(item, monitor, 'startedAt'),
  });

  const [{ isBottomResizing }, resizeBottomDropRef] = useDrop({
    accept: 'resize-bottom',
    canDrop: () => true,
    collect: (monitor) => ({
      isBottomResizing: monitor.getItemType() === 'resize-bottom',
    }),
    hover: (
      item: (GetTodoOutput | GetReviewOutput) & { type: DragItemType },
      monitor: DropTargetMonitor,
    ) => resizingHover(item, monitor, 'finishedAt'),
    drop: (
      item: (GetTodoOutput | GetReviewOutput) & { type: DragItemType },
      monitor: DropTargetMonitor,
    ) => resizingDrop(item, monitor, 'finishedAt'),
  });

  const isResizing = useMemo(
    () => isTopResizing || isBottomResizing,
    [isTopResizing, isBottomResizing],
  );

  useEffect(() => {
    if (timeTitleRef.current) {
      const timeRect = timeTitleRef.current.getBoundingClientRect();
      setTimeCardWidth(timeRect.width);
    }
  }, [timeTitleRef]);

  useEffect(() => {
    if (todoTitleRef.current) {
      const todoRect = todoTitleRef.current.getBoundingClientRect();
      setDiaryCardWidth(todoRect.width);
    }
  }, [todoTitleRef, windowSize]);

  useEffect(() => {
    if (diaryContainerRef.current) {
      todoDrop(diaryContainerRef);
      reviewDrop(diaryContainerRef);
      resizeTopDropRef(diaryContainerRef);
      resizeBottomDropRef(diaryContainerRef);
      const diaryContainerRect =
        diaryContainerRef.current.getBoundingClientRect();
      setDiaryContainerStartedY(diaryContainerRect.top);

      const savedScrollTop = localStorage.getItem('scrollTop');
      if (savedScrollTop) {
        diaryContainerRef.current.scrollTo({
          top: Number(savedScrollTop),
          behavior: 'auto',
        });
      }
      setScrollSave(true);
    }
  }, [diaryContainerRef, windowSize]);

  useEffect(() => {
    if (diaryContainerRef.current) {
      const diaryContainerRect =
        diaryContainerRef.current.getBoundingClientRect();
      setDiaryContainerStartedY(diaryContainerRect.top);
    }
  }, [isTimeUndecidedDiary]);

  useEffect(() => {
    if (isScrollSave) {
      localStorage.setItem('scrollTop', String(scrollTop));
    }
  }, [scrollTop]);

  return (
    <StyledMainTemplate>
      <MainHeader dataMe={dataMe} today={today} setToday={setToday} />
      <StyledBody>
        <WeekCalendar today={today} setToday={setToday} />
        <StyledDiaryTitleContainer>
          <StyledDiaryTitle isEmpty ref={timeTitleRef} />
          <StyledDiaryTitle isEmpty={false} ref={todoTitleRef}>
            오늘은 이렇게 보내고 싶어요
          </StyledDiaryTitle>
          <StyledDiaryTitle isEmpty={false}>
            오늘은 이렇게 보내고 싶어요
          </StyledDiaryTitle>
        </StyledDiaryTitleContainer>
        <StyledTimeUndecidedContainer
          isTimeUndecidedDiary={isTimeUndecidedDiary}
        >
          <StyledTimeUndecided width={timeCardWidth}>
            {isTimeUndecidedDiary ? '시간 미정' : ''}
          </StyledTimeUndecided>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <DiaryCreateCard
              dragItemType="todo"
              inputPlaceHolder="예정된 할일을 입력해주세요."
              createDiary={createTodo}
            />
            {isTimeUndecidedTodos &&
              dataTodos?.timeUndecidedTodos.map((todo, i) => {
                const { startedAt, finishedAt } = todo;
                const height = getDiaryCardHeight(startedAt, finishedAt);

                return (
                  <DiaryCard
                    itemType="todo"
                    item={todo}
                    height={height}
                    parentWidth={diaryCardWidth}
                    left={timeCardWidth}
                    key={todo.id}
                    styleType="timeLess"
                    originalIndex={i}
                    today={today}
                    setIsCanDrop={(v: boolean) => {
                      if (isCanDrop !== v) {
                        setIsCanDrop(v);
                      }
                    }}
                    updateItem={updateTodo}
                    deleteItem={deleteTodo}
                  />
                );
              })}
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <DiaryCreateCard
              dragItemType="review"
              inputPlaceHolder="오늘 했던 일을 입력해주세요."
              createDiary={createReview}
            />
            {isTimeUndecidedReviews &&
              dataReviews?.timeUndecidedReviews.map((review, i) => {
                const { startedAt, finishedAt } = review;
                const height = getDiaryCardHeight(startedAt, finishedAt);

                return (
                  <DiaryCard
                    itemType="review"
                    item={review}
                    height={height}
                    parentWidth={diaryCardWidth}
                    left={timeCardWidth + diaryCardWidth}
                    key={review.id}
                    styleType="timeLess"
                    originalIndex={i}
                    today={today}
                    setIsCanDrop={(v: boolean) => {
                      if (isCanDrop !== v) {
                        setIsCanDrop(v);
                      }
                    }}
                    updateItem={updateReview}
                    deleteItem={deleteReview}
                  />
                );
              })}
          </div>
        </StyledTimeUndecidedContainer>
        <StyledDiaryContainer
          ref={diaryContainerRef}
          onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const currentScrollTop = e.currentTarget.scrollTop;
            if (isScrollSave) {
              setScrollTop(currentScrollTop);
            }
          }}
        >
          {browser.name === Browser.Firefox && !isResizing && (
            <DiaryCardDragLayer
              parentWidth={diaryCardWidth}
              today={today}
              x={timeTitleRef.current?.getBoundingClientRect().right ?? 0}
            />
          )}
          {[...new Array(24).keys()].map((hour, i) => {
            const top = i * 60;

            return (
              <StyledTime
                width={timeCardWidth}
                key={hour}
                isNowHour={nowHour === hour}
                top={top}
              >
                {hour}시
              </StyledTime>
            );
          })}
          {dataTodos?.todos.map((t, i) => {
            let todo = t;
            const { startedAt, finishedAt, completedAt } = todo;
            let height = getDiaryCardHeight(startedAt, finishedAt);

            if (resizingCard) {
              const { type, item } = resizingCard;
              if (type === 'todo' && item.id === todo.id) {
                height = getDiaryCardHeight(item.startedAt, item.finishedAt);
                todo = item;
              }
            }

            return (
              <DiaryCard
                itemType="todo"
                item={todo}
                height={height}
                parentWidth={diaryCardWidth}
                left={timeCardWidth}
                key={todo.id}
                styleType="none"
                originalIndex={i}
                today={today}
                setIsCanDrop={(v: boolean) => {
                  if (isCanDrop !== v) {
                    setIsCanDrop(v);
                  }
                }}
                isCompleted={!!completedAt}
                updateItem={updateTodo}
                deleteItem={deleteTodo}
              />
            );
          })}
          {dataReviews?.reviews.map((r, i) => {
            let review = r;
            const { startedAt, finishedAt } = review;
            let height = getDiaryCardHeight(startedAt, finishedAt);

            if (resizingCard) {
              const { type, item } = resizingCard;
              if (type === 'review' && item.id === review.id) {
                height = getDiaryCardHeight(item.startedAt, item.finishedAt);
                review = item;
              }
            }

            return (
              <DiaryCard
                itemType="review"
                item={review}
                height={height}
                parentWidth={diaryCardWidth}
                left={timeCardWidth + diaryCardWidth}
                key={review.id}
                styleType="none"
                originalIndex={i}
                today={today}
                setIsCanDrop={(v: boolean) => {
                  if (isCanDrop !== v) {
                    setIsCanDrop(v);
                  }
                }}
                updateItem={updateReview}
                deleteItem={deleteReview}
              />
            );
          })}
        </StyledDiaryContainer>
      </StyledBody>
    </StyledMainTemplate>
  );
};
