import { useEffect } from "react";

interface UseKeyboardControlsProps {
  cursorPosition: number;
  formula: string;
  setCursorPosition: (position: number) => void;
  onDelete: () => void;
  disabled?: boolean; // New prop to disable keyboard controls
}

export const useKeyboardControls = ({
  cursorPosition,
  formula,
  setCursorPosition,
  onDelete,
  disabled = false, // Default to enabled
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return; // Don't handle keyboard events when disabled

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setCursorPosition(Math.max(cursorPosition - 1, 0));
          break;
        case "ArrowRight":
          event.preventDefault();
          setCursorPosition(Math.min(cursorPosition + 1, formula.length));
          break;
        case "Delete":
        case "Backspace":
          event.preventDefault();
          onDelete();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursorPosition, formula, setCursorPosition, onDelete, disabled]);
};
