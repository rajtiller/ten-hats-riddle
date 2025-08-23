import { calculatePersonGuess } from "./evaluateFormula";

export const testFormula = (formula: string): number[] => {
  const startTime = Date.now();
  const testDuration = 1000; // 1 second in milliseconds

  let totalTests = 0;
  let successfulTests = 0;
  var firstCounterExample: number[] | null = null;

  while (Date.now() - startTime < testDuration) {
    // Generate random hat configuration
    const guess = generateRandomHats();

    // check if anyone guesses their hat color correctly
    if (!hasCorrectGuess(formula, guess)) {
      return guess;
    } 
  }


  // No counter-example found - formula appears correct
  // Return a random valid configuration with a special marker
  const randomValidConfig = generateRandomHats();
  // Add a marker at index 10 to indicate this is a correct formula
  return [...randomValidConfig, -1]; // -1 indicates correct formula
};

// Generate random hat configuration for testing
const generateRandomHats = (): number[] => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
};

// Helper function using the existing calculatePersonGuess
function hasCorrectGuess(formula: string, hatColors: number[]): boolean {
  for (let personIndex = 0; personIndex < 10; personIndex++) {
    try {
      const guess = calculatePersonGuess(hatColors, formula, personIndex);
      const actualHatColor = hatColors[personIndex];

      if (guess === actualHatColor) {
        return true; // Someone guessed correctly - this is a counter-example
      }
    } catch (error) {
      // If formula evaluation fails, continue to next person
      continue;
    }
  }
  return false; // No one guessed correctly - formula works for this configuration
}

export interface TestResult {
  isCorrect: boolean;
  counterExample?: number[];
  message: string;
}

export const evaluateTestResult = (result: number[]): TestResult => {
  if (result.length === 11 && result[10] === -1) {
    // Correct formula with example configuration
    return {
      isCorrect: true,
      counterExample: result.slice(0, 10), // First 10 elements are the example
      message: "✅ Correct solution!",
    };
  } else if (result.length === 0) {
    return {
      isCorrect: true,
      message: "✅ Correct solution!",
    };
  } else {
    return {
      isCorrect: false,
      counterExample: result,
      message: `❌ Counter example: People guess [${result.join(", ")}]`,
    };
  }
};
