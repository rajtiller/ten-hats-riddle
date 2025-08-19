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

  const charAtCursor = formula[cursorPosition - 1];
  const charBeforeCursor = formula[cursorPosition - 2];
  const charAfterCursor = formula[cursorPosition];

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
