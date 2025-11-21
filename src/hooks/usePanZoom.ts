import { useState, useCallback, useRef, useEffect } from 'react';

interface PanZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.2;

export function usePanZoom(containerWidth: number, containerHeight: number) {
  const [state, setState] = useState<PanZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const isPanningRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const zoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: Math.min(prev.scale + ZOOM_STEP, MAX_SCALE),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      scale: Math.max(prev.scale - ZOOM_STEP, MIN_SCALE),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setState({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      isPanningRef.current = true;
      startPosRef.current = { x: e.clientX - state.translateX, y: e.clientY - state.translateY };
      e.preventDefault();
    }
  }, [state.translateX, state.translateY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanningRef.current) {
      setState(prev => ({
        ...prev,
        translateX: e.clientX - startPosRef.current.x,
        translateY: e.clientY - startPosRef.current.y,
      }));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setState(prev => ({
      ...prev,
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale + delta)),
    }));
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    scale: state.scale,
    translateX: state.translateX,
    translateY: state.translateY,
    zoomIn,
    zoomOut,
    resetZoom,
    handleMouseDown,
    handleWheel,
    isPanning: isPanningRef.current,
  };
}
