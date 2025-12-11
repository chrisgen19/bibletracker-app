import { useState, useRef, useCallback, TouchEvent, MouseEvent } from 'react';

interface SwipeGestureOptions {
  onEdit?: () => void;
  onDelete?: () => void;
  editThreshold?: number;
  deleteThreshold?: number;
}

export function useSwipeGesture({
  onEdit,
  onDelete,
  editThreshold = 80,
  deleteThreshold = 150,
}: SwipeGestureOptions) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const currentX = useRef(0);
  const isSwipingHorizontal = useRef<boolean | null>(null);

  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwipingHorizontal.current = null;
    setIsAnimating(false);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Determine swipe direction on first significant movement
    if (isSwipingHorizontal.current === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isSwipingHorizontal.current = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // Only handle horizontal swipes
    if (isSwipingHorizontal.current) {
      e.preventDefault();
      currentX.current = deltaX;
      // Only allow left swipes (negative values)
      setSwipeOffset(Math.min(0, deltaX));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipingHorizontal.current) {
      setSwipeOffset(0);
      return;
    }

    const offset = currentX.current;
    setIsAnimating(true);

    // Determine action based on swipe distance
    if (offset <= -deleteThreshold && onDelete) {
      // Delete action
      onDelete();
      setSwipeOffset(0);
    } else if (offset <= -editThreshold && onEdit) {
      // Edit action
      onEdit();
      setSwipeOffset(0);
    } else {
      // Reset to original position
      setSwipeOffset(0);
    }

    isSwipingHorizontal.current = null;
  }, [onEdit, onDelete, editThreshold, deleteThreshold]);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true);
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    isSwipingHorizontal.current = null;
    setIsAnimating(false);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - touchStartX.current;
    const deltaY = e.clientY - touchStartY.current;

    // Determine drag direction on first significant movement
    if (isSwipingHorizontal.current === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isSwipingHorizontal.current = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // Only handle horizontal drags
    if (isSwipingHorizontal.current) {
      currentX.current = deltaX;
      // Only allow left drags (negative values)
      setSwipeOffset(Math.min(0, deltaX));
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (!isSwipingHorizontal.current) {
      setSwipeOffset(0);
      return;
    }

    const offset = currentX.current;
    setIsAnimating(true);

    // Determine action based on drag distance
    if (offset <= -deleteThreshold && onDelete) {
      // Delete action
      onDelete();
      setSwipeOffset(0);
    } else if (offset <= -editThreshold && onEdit) {
      // Edit action
      onEdit();
      setSwipeOffset(0);
    } else {
      // Reset to original position
      setSwipeOffset(0);
    }

    isSwipingHorizontal.current = null;
  }, [isDragging, onEdit, onDelete, editThreshold, deleteThreshold]);

  const getSwipeAction = (): 'none' | 'edit' | 'delete' => {
    const offset = Math.abs(swipeOffset);
    if (offset >= deleteThreshold) return 'delete';
    if (offset >= editThreshold) return 'edit';
    return 'none';
  };

  return {
    swipeOffset,
    isAnimating,
    swipeAction: getSwipeAction(),
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp, // Treat mouse leaving as mouse up
    },
  };
}
