import { deleteAtPosition } from "./utils";

export interface DeleteContext {
  formula: string;
  cursorPosition: number;
  setFormula: (formula: string) => void;
  setCursorPosition: (position: number) => void;
  setWaitingForBracketNumber: (waiting: boolean) => void;
  setErrorMessage: (message: string) => void;
  errorMessage: string;
}

export const handleDelete = (context: DeleteContext) => {
  const {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setWaitingForBracketNumber,
    setErrorMessage,
    errorMessage,
  } = context;

  if (cursorPosition <= 0) return;

  const charAtCursor = formula[cursorPosition - 1];
  const charBeforeCursor = formula[cursorPosition - 2];
  const charAfterCursor = formula[cursorPosition];

  // Check if cursor is at the end of "all" and delete the entire word
  if (
    cursorPosition >= 3 &&
    formula.substring(cursorPosition - 3, cursorPosition) === "all"
  ) {
    // Make sure it's not part of a longer word
    const charBeforeAll = cursorPosition > 3 ? formula[cursorPosition - 4] : "";
    if (!/[a-zA-Z]/.test(charBeforeAll)) {
      const newFormula =
        formula.slice(0, cursorPosition - 3) + formula.slice(cursorPosition);
      setFormula(newFormula);
      setCursorPosition(cursorPosition - 3);
      setWaitingForBracketNumber(false);
      if (errorMessage) setErrorMessage("");
      return;
    }
  }

  // Check if cursor is in front of a space and auto-delete it
  if (charAtCursor === " ") {
    const newFormula =
      formula.slice(0, cursorPosition - 1) + formula.slice(cursorPosition);
    setFormula(newFormula);
    setCursorPosition(cursorPosition - 1);
    setWaitingForBracketNumber(false);
    if (errorMessage) setErrorMessage("");
    return;
  }

  // Handle bracket construct deletion
  if (charAtCursor === "]") {
    if (handleBracketEndDeletion(context)) return;
  }

  // Handle number inside bracket deletion
  if (charAtCursor && /^[1-9]$/.test(charAtCursor) && charAfterCursor === "]") {
    if (handleNumberInBracketDeletion(context)) return;
  }

  // Handle incomplete bracket deletion
  if (
    charAtCursor === "[" &&
    charBeforeCursor &&
    ["r", "l"].includes(charBeforeCursor)
  ) {
    if (handleIncompleteBracketDeletion(context)) return;
  }

  // Handle empty bracket deletion
  if (charAtCursor === "]" && charBeforeCursor === "[") {
    if (handleEmptyBracketDeletion(context)) return;
  }

  // Handle 'i' variable deletion - check if cursor is at end of standalone 'i'
  if (charAtCursor === "i") {
    const charBeforeI = cursorPosition > 1 ? formula[cursorPosition - 2] : "";
    const charAfterI =
      cursorPosition < formula.length ? formula[cursorPosition] : "";

    // Only delete if 'i' is standalone (not part of another word)
    if (!/[a-zA-Z]/.test(charBeforeI) && !/[a-zA-Z]/.test(charAfterI)) {
      const newFormula =
        formula.slice(0, cursorPosition - 1) + formula.slice(cursorPosition);
      setFormula(newFormula);
      setCursorPosition(cursorPosition - 1);
      setWaitingForBracketNumber(false);
      if (errorMessage) setErrorMessage("");
      return;
    }
  }

  // Default delete behavior
  const { newText, newPosition } = deleteAtPosition(formula, cursorPosition);
  setFormula(newText);
  setCursorPosition(newPosition);
  setWaitingForBracketNumber(false);
  if (errorMessage) setErrorMessage("");
};

const handleBracketEndDeletion = (context: DeleteContext): boolean => {
  const {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setWaitingForBracketNumber,
    setErrorMessage,
    errorMessage,
  } = context;

  let bracketStart = cursorPosition - 2;
  while (bracketStart >= 0 && formula[bracketStart] !== "[") {
    bracketStart--;
  }

  if (bracketStart > 0 && ["r", "l"].includes(formula[bracketStart - 1])) {
    const constructStart = bracketStart - 1;
    const newFormula =
      formula.slice(0, constructStart) + formula.slice(cursorPosition);
    setFormula(newFormula);
    setCursorPosition(constructStart);
    setWaitingForBracketNumber(false);
    if (errorMessage) setErrorMessage("");
    return true;
  }

  return false;
};

const handleNumberInBracketDeletion = (context: DeleteContext): boolean => {
  const {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setWaitingForBracketNumber,
    setErrorMessage,
    errorMessage,
  } = context;

  let bracketStart = cursorPosition - 2;
  while (bracketStart >= 0 && formula[bracketStart] !== "[") {
    bracketStart--;
  }

  if (bracketStart > 0 && ["r", "l"].includes(formula[bracketStart - 1])) {
    const constructStart = bracketStart - 1;
    const newFormula =
      formula.slice(0, constructStart) + formula.slice(cursorPosition + 1);
    setFormula(newFormula);
    setCursorPosition(constructStart);
    setWaitingForBracketNumber(false);
    if (errorMessage) setErrorMessage("");
    return true;
  }

  return false;
};

const handleIncompleteBracketDeletion = (context: DeleteContext): boolean => {
  const {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setWaitingForBracketNumber,
    setErrorMessage,
    errorMessage,
  } = context;

  const newFormula =
    formula.slice(0, cursorPosition - 2) + formula.slice(cursorPosition + 1);
  setFormula(newFormula);
  setCursorPosition(cursorPosition - 2);
  setWaitingForBracketNumber(false);
  if (errorMessage) setErrorMessage("");
  return true;
};

const handleEmptyBracketDeletion = (context: DeleteContext): boolean => {
  const {
    formula,
    cursorPosition,
    setFormula,
    setCursorPosition,
    setWaitingForBracketNumber,
    setErrorMessage,
    errorMessage,
  } = context;

  let bracketTypePos = cursorPosition - 3;
  if (bracketTypePos >= 0 && ["r", "l"].includes(formula[bracketTypePos])) {
    const newFormula =
      formula.slice(0, bracketTypePos) + formula.slice(cursorPosition);
    setFormula(newFormula);
    setCursorPosition(bracketTypePos);
    setWaitingForBracketNumber(false);
    if (errorMessage) setErrorMessage("");
    return true;
  }

  return false;
};
