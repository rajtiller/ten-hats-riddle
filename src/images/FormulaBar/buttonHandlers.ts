export interface ButtonContext {
  insertAtCursor: (text: string) => void;
  setCursorPosition: (position: number) => void;
  cursorPosition: number;
  setWaitingForBracketNumber: (waiting: boolean) => void;
  handleDelete: () => void;
}

export const handleButtonClick = (
  value: string,
  context: ButtonContext,
  waitingForBracketNumber: boolean
) => {
  const {
    insertAtCursor,
    setCursorPosition,
    cursorPosition,
    setWaitingForBracketNumber,
    handleDelete,
  } = context;

  if (waitingForBracketNumber) {
    if (/^[1-9]$/.test(value)) {
      insertAtCursor(value);
      setCursorPosition(cursorPosition + 2);
      setWaitingForBracketNumber(false);
    } else if (value === "del") {
      handleDelete();
    }
    return;
  }

  switch (value) {
    case "(":
    case ")":
    case "i":
      insertAtCursor(value);
      break;
    case "r[":
      insertAtCursor("r[]");
      setCursorPosition(cursorPosition + 2);
      setWaitingForBracketNumber(true);
      break;
    case "l[":
      insertAtCursor("l[]");
      setCursorPosition(cursorPosition + 2);
      setWaitingForBracketNumber(true);
      break;
    case "all":
      insertAtCursor("all");
      break;
    case "del":
      handleDelete();
      break;
    case "+":
      insertAtCursor(" + ");
      break;
    case "-":
      insertAtCursor(" - ");
      break;
    case "x":
      insertAtCursor(" × ");
      break;
    default:
      if (/^[0-9]$/.test(value)) {
        insertAtCursor(value);
      }
      break;
  }
};

export const handleButtonClickEnhanced = (
  value: string,
  context: ButtonContext,
  waitingForBracketNumber: boolean
) => {
  const {
    insertAtCursor,
    // setCursorPosition,
    // cursorPosition,
    setWaitingForBracketNumber,
    handleDelete,
  } = context;

  if (waitingForBracketNumber) {
    if (/^[1-9]$/.test(value)) {
      insertAtCursor(value + "]");
      setWaitingForBracketNumber(false);
    } else if (value === "del") {
      handleDelete();
    }
    return;
  }

  switch (value) {
    case "(":
    case ")":
    case "i":
      insertAtCursor(value);
      break;
    case "l[":
      insertAtCursor("l[");
      setWaitingForBracketNumber(true);
      break;
    case "r[":
      insertAtCursor("r[");
      setWaitingForBracketNumber(true);
      break;
    case "all":
      insertAtCursor("all");
      break;
    case "del":
      handleDelete();
      break;
    case "+":
      insertAtCursor(" + ");
      break;
    case "-":
      insertAtCursor(" - ");
      break;
    case "×": // Changed from "x" to "×"
    case "x": // Also handle "x" for backward compatibility
      insertAtCursor(" × ");
      break;
    default:
      if (/^[0-9]$/.test(value)) {
        insertAtCursor(value);
      }
      break;
  }
};
