import { useEffect, useState } from 'react';

type Size = {
  width: number | undefined;
  height: number | undefined;
};

const RESIZE = 'resize';

export const useWindowSize = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener(RESIZE, handleResize);

    handleResize();

    return () => window.removeEventListener(RESIZE, handleResize);
  }, []);

  return windowSize;
};
