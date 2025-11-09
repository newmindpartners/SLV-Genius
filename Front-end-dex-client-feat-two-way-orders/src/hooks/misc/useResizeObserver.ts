import { useEffect } from 'react';

type UseMaxOrderBookTableHeightArgs = {
  containerRef: React.MutableRefObject<HTMLElement | null>;
  onResize: (entries: ResizeObserverEntry[]) => void;
};

const useResizeObserver = ({
  containerRef,
  onResize,
}: UseMaxOrderBookTableHeightArgs) => {
  useEffect(() => {
    if (containerRef && containerRef.current) {
      const resizeObserver = new ResizeObserver(onResize);
      const parentElement = containerRef.current.parentNode;

      if (parentElement instanceof HTMLElement) {
        resizeObserver.observe(parentElement);
      }

      return () => {
        if (parentElement instanceof HTMLElement) {
          resizeObserver.unobserve(parentElement);
        }
      };
    }
  }, []);
};

export default useResizeObserver;
