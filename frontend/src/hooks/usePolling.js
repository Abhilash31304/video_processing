import { useEffect, useRef } from 'react';

const usePolling = (callback, interval = 3000, dependencies = []) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    // Call immediately
    tick();

    // Then poll at interval
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, ...dependencies]);
};

export default usePolling;
