import { useEffect } from 'react';

export function useKeyboard(
  handlers: {
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
  }
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && handlers.onArrowLeft) {
        e.preventDefault();
        handlers.onArrowLeft();
      } else if (e.key === 'ArrowRight' && handlers.onArrowRight) {
        e.preventDefault();
        handlers.onArrowRight();
      } else if (e.key === ' ' && handlers.onSpace) {
        e.preventDefault();
        handlers.onSpace();
      } else if (e.key === 'Escape' && handlers.onEscape) {
        e.preventDefault();
        handlers.onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
