export const findMatchingBracket = (
  formula: string,
  position: number
): number | null => {
  const char = formula[position];
  let stack = 0;
  let searchChar = "";
  let matchChar = "";
  let direction = 1;

  if (char === "(") {
    searchChar = "(";
    matchChar = ")";
    direction = 1;
  } else if (char === ")") {
    searchChar = ")";
    matchChar = "(";
    direction = -1;
  } else if (char === "]") {
    // For closing bracket, find the opening bracket pattern (r[, l[, p[)
    searchChar = "]";
    matchChar = "[";
    direction = -1;
  } else if (char === "[" && position > 0) {
    // Check if this is part of r[, l[, or p[
    const prevChar = formula[position - 1];
    if (["r", "l", "p"].includes(prevChar)) {
      searchChar = "[";
      matchChar = "]";
      direction = 1;
    } else {
      return null;
    }
  } else {
    return null;
  }

  for (
    let i = position + direction;
    i >= 0 && i < formula.length;
    i += direction
  ) {
    if (formula[i] === searchChar) {
      // For opening brackets, check if it's part of r[, l[, p[
      if (searchChar === "[" && i > 0) {
        const prevChar = formula[i - 1];
        if (["r", "l", "p"].includes(prevChar)) {
          stack++;
        }
      } else if (searchChar !== "[") {
        stack++;
      }
    } else if (formula[i] === matchChar) {
      if (stack === 0) {
        return i;
      }
      stack--;
    }
  }
  return null;
};

export const insertTextAtPosition = (
  text: string,
  position: number,
  insertText: string
): { newText: string; newPosition: number } => {
  const newText = text.slice(0, position) + insertText + text.slice(position);
  return {
    newText,
    newPosition: position + insertText.length,
  };
};

export const deleteAtPosition = (
  text: string,
  position: number
): { newText: string; newPosition: number } => {
  if (position > 0) {
    const newText = text.slice(0, position - 1) + text.slice(position);
    return {
      newText,
      newPosition: position - 1,
    };
  }
  return { newText: text, newPosition: position };
};
