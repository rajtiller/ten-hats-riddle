import { useEffect } from "react";

interface UseKeyboardControlsProps {
  cursorPosition: number;
  formula: string;
  setCursorPosition: (position: number) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export const useKeyboardControls = ({
  cursorPosition,
  formula,
  setCursorPosition,
  onDelete,
  disabled = false,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
          // Disable arrow keys completely - prevent default but don't move cursor
          event.preventDefault();
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
