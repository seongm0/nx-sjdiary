import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';
import styled from 'styled-components';

import { getDiaryCardHeight } from '../../../utils';
import { DiaryCard } from '../../organisms';

const StyledDragLayer = styled.div<{ parentWidth: number; height: number }>`
  position: fixed;
  pointer-events: none;

  z-index: 10000;

  left: 0;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ parentWidth }) => parentWidth}px;
  height: ${({ height }) => height}px;

  box-shadow: 5px 5px 10px #000000;

  background-color: ${({ theme }) => theme.colors.black2};
`;

const getDragLayerStyles = (
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
): CSSProperties => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
};

type PropTypes = {
  parentWidth: number;
  today: Date;
  x: number;
};

export const DiaryCardDragLayer: FC<PropTypes> = ({
  parentWidth = 0,
  today,
  x,
}) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor: DragLayerMonitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (item) {
      setIsCompleted(!!item.completedAt);
    }
  }, [item]);

  if (!isDragging) {
    return null;
  }

  const { startedAt, finishedAt } = item;
  const height = getDiaryCardHeight(startedAt, finishedAt);

  return (
    <StyledDragLayer
      parentWidth={parentWidth}
      style={getDragLayerStyles(initialOffset, currentOffset)}
      height={height}
    >
      <DiaryCard
        setIsCanDrop={() => {}}
        itemType={itemType as 'todo' | 'review'}
        left={0}
        height={height}
        parentWidth={parentWidth}
        styleType="drag"
        item={item}
        today={today}
        updateItem={() => {}}
        deleteItem={() => {}}
        isCompleted={isCompleted}
      />
    </StyledDragLayer>
  );
};
