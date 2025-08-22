import { calculatePersonGuess } from "./evaluateFormula";

export const testFormula = (formula: string): number[] => {
  const startTime = Date.now();
  const testDuration = 1000; // 1 second in milliseconds
  // const initialGuessses = [[0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1],[0,1,0,1,0,1,0,1,0,1],[0,1,2,3,4,5,4,3,2,1],[0,1,2,3,4,0,1,2,3,4],[0,1,2,3,4,5,6,7,8,9],[9,8,7,6,5,4,3,2,1,0]];

  // for (const initialGuess of initialGuessses) {
  //   // Check if the formula is correct for this initial guess
  //   if (!hasCorrectGuess(formula, initialGuess)) {
  //     return initialGuess; // Found a counter-example
  //   }
  // }
  while (Date.now() - startTime < testDuration) {
    // Generate random hat configuration
    const guess = generateRandomHats();

    // check if anyone guesses their hat color correctly
    if (!hasCorrectGuess(formula, guess)) {
        return guess; // Found a counter-example
      }
    }
  return []; // No counter-example found within 1 second - formula appears correct
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
  if (result.length === 0) {
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
