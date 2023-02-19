import React from "react";

export const useDimensions = <T extends HTMLElement>() => {
  const [node, setNode] = React.useState<T>();
  const [dimensions, setDimensions] = React.useState<DOMRect>();
  // Intercept ref and store node data in react state.
  const ref = React.useCallback((node: T) => {
    setNode(node);
  }, []);
  React.useLayoutEffect(() => {
    if (node) {
      const observer = new ResizeObserver((entries) => {
        setDimensions(entries[0]?.contentRect);
      });
      observer.observe(node);
      return () => observer.unobserve(node);
    }
  }, [node]);

  return { ref, node, dimensions };
};
