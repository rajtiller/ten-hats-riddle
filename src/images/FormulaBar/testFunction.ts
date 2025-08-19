export const testFormula = (formula: string): number[] => {
  // TODO: Implement actual test logic
  // This will contain the real algorithm to test if the formula works
  // For now, return example counter-example
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
};

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
