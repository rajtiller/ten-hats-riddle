export const evaluateFormula = (
  hatColors: number[],
  formula: string
): number => {
  // Validate inputs
  if (hatColors.length !== 9) {
    throw new Error("hatColors array must contain exactly 9 elements");
  }

  if (
    !hatColors.every(
      (color) => Number.isInteger(color) && color >= 0 && color <= 9
    )
  ) {
    throw new Error("All hat colors must be integers from 0-9");
  }

  if (!formula || typeof formula !== "string") {
    throw new Error("Formula must be a non-empty string");
  }

  // Create a working copy of the formula
  let processedFormula = formula.trim();

  // Replace 'x' with '*' for multiplication
  processedFormula = processedFormula.replace(/x/g, "*");

  // Replace 'i' with person 0's hat color (current person)
  // Note: We don't have the current person's hat color, so we'll use a placeholder
  // This will be handled by the calling function
  processedFormula = processedFormula.replace(/\bi\b/g, "CURRENT_PERSON_HAT");

  // Replace 'all' with sum of all visible hat colors
  const allSum = hatColors.reduce((sum, color) => sum + color, 0);
  processedFormula = processedFormula.replace(/\ball\b/g, allSum.toString());

  // Replace l[n] patterns with left neighbor hat colors
  processedFormula = processedFormula.replace(/l\[(\d+)\]/g, (_, position) => {
    const pos = parseInt(position);
    if (pos < 1 || pos > 9) {
      throw new Error(`Invalid left position: ${pos}. Must be 1-9`);
    }

    // Convert to 0-based index for hatColors array
    // l[1] = hatColors[0], l[2] = hatColors[1], etc.
    const arrayIndex = pos - 1;

    if (arrayIndex >= hatColors.length) {
      throw new Error(`Position l[${pos}] exceeds available hat colors`);
    }

    return hatColors[arrayIndex].toString();
  });

  // Replace r[n] patterns with right neighbor hat colors
  processedFormula = processedFormula.replace(/r\[(\d+)\]/g, (_, position) => {
    const pos = parseInt(position);
    if (pos < 1 || pos > 9) {
      throw new Error(`Invalid right position: ${pos}. Must be 1-9`);
    }

    // For right positions, we need to map them to the correct array indices
    // r[1] corresponds to the person 1 position to the right
    // This depends on the specific positioning logic in your application
    // For now, let's assume r[n] maps to hatColors[9-n] (reverse order)
    const arrayIndex = 9 - pos;

    if (arrayIndex < 0 || arrayIndex >= hatColors.length) {
      throw new Error(`Position r[${pos}] maps to invalid array index`);
    }

    return hatColors[arrayIndex].toString();
  });

  // If formula still contains CURRENT_PERSON_HAT, we need that value
  if (processedFormula.includes("CURRENT_PERSON_HAT")) {
    throw new Error(
      "Cannot evaluate formula without current person's hat color"
    );
  }

  // Validate that only valid characters remain
  const validChars = /^[\d+\-*/()\s]+$/;
  if (!validChars.test(processedFormula)) {
    throw new Error(
      `Formula contains invalid characters after processing: ${processedFormula}`
    );
  }

  try {
    // Use Function constructor to safely evaluate the mathematical expression
    // This is safer than eval() but still requires trust in the input
    const result = new Function(`"use strict"; return (${processedFormula})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Formula evaluation resulted in non-finite number");
    }

    // Apply mod 10 and ensure positive result
    const modResult = ((result % 10) + 10) % 10;

    return Math.floor(modResult);
  } catch (error) {
    throw new Error(
      `Error evaluating formula "${processedFormula}": ${
        (error as Error).message
      }`
    );
  }
};

// Helper function that calculates what a specific person would guess
export const calculatePersonGuess = (
  allHatColors: number[], // Array of 10 hat colors
  formula: string,
  personIndex: number // Which person is making the guess (0-9)
): number => {
  if (allHatColors.length !== 10) {
    throw new Error("allHatColors array must contain exactly 10 elements");
  }

  if (personIndex < 0 || personIndex > 9) {
    throw new Error("personIndex must be between 0 and 9");
  }

  // Extract the 9 visible hat colors (excluding the person making the guess)
  const visibleHatColors = allHatColors.filter(
    (_, index) => index !== personIndex
  );

  // Process formula to replace variables
  let processedFormula = formula.trim();

  // Replace 'x' with '*' for multiplication
  processedFormula = processedFormula.replace(/×/g, "*");

  // Replace 'i' with the person's NUMBER (their index), not their hat color
  processedFormula = processedFormula.replace(/\bi\b/g, personIndex.toString());

  // Replace 'all' with sum of all visible hat colors
  const allSum = visibleHatColors.reduce((sum, color) => sum + color, 0);
  processedFormula = processedFormula.replace(/\ball\b/g, allSum.toString());

  // Replace l[n] patterns - these represent people to the left of the current person
  processedFormula = processedFormula.replace(
    /l\[(\d+)\]/g,
    (_, position) => {
      const pos = parseInt(position);
      if (pos < 1 || pos > 9) {
        throw new Error(`Invalid left position: ${pos}. Must be 1-9`);
      }

      // Calculate which person this refers to relative to personIndex
      const targetPersonIndex = (personIndex + pos) % 10;
      return allHatColors[targetPersonIndex].toString();
    }
  );

  // Replace r[n] patterns - these represent people to the right of the current person
  processedFormula = processedFormula.replace(
    /r\[(\d+)\]/g,
    (_, position) => {
      const pos = parseInt(position);
      if (pos < 1 || pos > 9) {
        throw new Error(`Invalid right position: ${pos}. Must be 1-9`);
      }

      // Calculate which person this refers to relative to personIndex
      const targetPersonIndex = (personIndex - pos + 10) % 10;
      return allHatColors[targetPersonIndex].toString();
    }
  );

  try {
    const result = new Function(`"use strict"; return (${processedFormula})`)();

    if (Number.isFinite(result)) {
      const modResult = ((result % 10) + 10) % 10;
      return Math.floor(modResult);
    }
  } catch (error) {
    console.error(`Error evaluating formula for person ${personIndex}:`, error);
    return -1;
  }

  // If evaluation failed, return -1 to indicate error
  return -1;
};

// Original helper function preserved for compatibility
export const evaluateFormulaWithCurrentPerson = (
  allHatColors: number[], // Array of 10 hat colors including current person
  formula: string,
  currentPersonIndex: number = 0
): number => {
  if (allHatColors.length !== 10) {
    throw new Error("allHatColors array must contain exactly 10 elements");
  }

  // Extract the 9 visible hat colors (excluding current person)
  const visibleHatColors = allHatColors.filter(
    (_, index) => index !== currentPersonIndex
  );

  // Get current person's hat color
  const currentPersonHat = allHatColors[currentPersonIndex];

  // Process formula to replace 'i' with current person's hat color
  let processedFormula = formula.trim();
  processedFormula = processedFormula.replace(
    /\bi\b/g,
    currentPersonHat.toString()
  );

  // Now evaluate with the visible hat colors
  return evaluateFormula(visibleHatColors, processedFormula);
};
