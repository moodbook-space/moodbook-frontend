import { useEffect, useRef } from 'react';

/**
 * @param {object} props
 * @param {HTMLElement | null} props.target
 * @param {function} props.onIntersect
 */
export const useIntersectionObserver = (props) => {
  const { target, onIntersect } = props;

  const isThrottledRef = useRef(false);

  useEffect(() => {
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isThrottledRef.current) {
          return;
        }

        if (entries.some((entry) => entry.isIntersecting)) {
          onIntersect();

          isThrottledRef.current = true;
          setTimeout(() => {
            isThrottledRef.current = false;
          }, 500);
        }
      },
      // * 요소가 화면에 온전히 다 나타나면 동작
      { threshold: 1 },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [target, onIntersect]);
};
