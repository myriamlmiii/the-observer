import { useEffect, useRef, useState } from "react";

export function useUniverse(initial) {
  const [state, setState] = useState(initial);
  const frame = useRef(0);

  useEffect(() => {
    frame.current++;
  }, [state]);

  return {
    state,
    setState,
    frame,
  };
}