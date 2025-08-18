import { useEffect } from "react";

interface UseKeyboardControlsProps {
  cursorPosition: number;
  formula: string;
  setCursorPosition: (position: number) => void;
  onDelete: () => void;
}

export const useKeyboardControls = ({
  cursorPosition,
  formula,
  setCursorPosition,
  onDelete,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [cursorPosition, formula, setCursorPosition, onDelete]);
};
