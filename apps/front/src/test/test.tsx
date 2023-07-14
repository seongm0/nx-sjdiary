import {
  CSSProperties,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  DragLayerMonitor,
  DragSourceMonitor,
  useDrag,
  useDragLayer,
  useDrop,
  XYCoord,
} from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import styled from 'styled-components';

type DragItem = {
  id: string;
  type: string;
  left: number;
  top: number;
};

type Box = {
  top: number;
  left: number;
  title: string;
};

type BoxMap = {
  [key: string]: Box;
};

type DraggableBoxProps = {
  id: string;
  showEmptyPlaceholder: boolean;
  item: Box;
};

export const ItemType = { BOX: 'box' } as const;

const getDraggableBoxStyles = (
  left: number,
  top: number,
  isDragging: boolean,
): CSSProperties => {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,

    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  };
};

const StyledDragItem = styled.div`
  background-color: red;
  padding: 10px;
  border-radius: 7px;
  display: inline-block;

  :hover {
    cursor: pointer;
    background-color: blue;
  }
`;

const DraggableBox = memo(
  ({ id, showEmptyPlaceholder, item }: DraggableBoxProps) => {
    const { title, left, top } = item;

    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemType.BOX,
      item: { type: ItemType.BOX, id, left, top, title },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    useEffect(() => {
      if (showEmptyPlaceholder) {
        preview(getEmptyImage(), { captureDraggingState: true });
      }
    }, [showEmptyPlaceholder, preview]);

    return (
      <StyledDragItem
        ref={drag}
        style={getDraggableBoxStyles(left, top, isDragging)}
      >
        {title}
      </StyledDragItem>
    );
  },
);

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

const StyledDragLayer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const CustomDragLayer: FC = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor: DragLayerMonitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  const renderItem = () => {
    switch (itemType) {
      case ItemType.BOX:
        return <StyledDragItem>{item.title}</StyledDragItem>;
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }

  return (
    <StyledDragLayer>
      <div style={getDragLayerStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </StyledDragLayer>
  );
};

const initialBoxes: BoxMap = {
  a: { top: 20, left: 80, title: 'Drag me around' },
  b: { top: 180, left: 20, title: 'Drag me too' },
};

const StyledDragContainer = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid black;
  position: relative;
`;

const Container = () => {
  const [boxes, setBoxes] = useState<BoxMap>(initialBoxes);
  const [showEmptyPlaceholder, setShowEmptyPlaceholder] = useState(false);

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setBoxes({
        ...boxes,
        [id]: {
          ...boxes[id],
          left,
          top,
        },
      });
    },
    [boxes],
  );

  const [, drop] = useDrop({
    accept: ItemType.BOX,
    drop(item: DragItem, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() as {
        x: number;
        y: number;
      };

      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);

      moveBox(item.id, left, top);

      return undefined;
    },
  });

  return (
    <>
      <StyledDragContainer ref={drop}>
        {Object.keys(boxes).map((key) => (
          <DraggableBox
            key={key}
            id={key}
            item={boxes[key]}
            showEmptyPlaceholder={showEmptyPlaceholder}
          />
        ))}
      </StyledDragContainer>

      <input
        id="placeholder"
        type="checkbox"
        checked={showEmptyPlaceholder}
        onChange={() => setShowEmptyPlaceholder(!showEmptyPlaceholder)}
      />
      <span>Show empty placeholder during drag</span>
    </>
  );
};

const StyledTestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

export const Test = () => {
  return (
    <StyledTestWrapper
      style={{
        display: 'flex',
        backgroundColor: 'white',
      }}
    >
      <Container />
      <CustomDragLayer />
    </StyledTestWrapper>
  );
};
