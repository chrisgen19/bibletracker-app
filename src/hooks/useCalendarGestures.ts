import { useState, useCallback } from 'react';

interface GestureState {
  dragStart: number | null;
  dragOffset: number;
}

export function useCalendarGestures(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragStart(e.clientX);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (dragStart === null) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  }, [dragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    if (dragStart !== null) {
      if (dragOffset > 100) onSwipeRight();
      if (dragOffset < -100) onSwipeLeft();
    }
    setDragStart(null);
    setDragOffset(0);
  }, [dragStart, dragOffset, onSwipeLeft, onSwipeRight]);

  return {
    dragOffset,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
    }
  };
}
