import React, { useState } from "react";
import FormulaBar from "./FormulaBar/index";
import Group from "./Group";
import HatLegend from "./HatLegend";
import { type PersonHighlight } from "./FormulaBar/FormulaDisplay";
import { calculatePersonGuess } from "./FormulaBar/evaluateFormula";

type AppState = "input" | "results";

interface TestResult {
  isCorrect: boolean;
  counterExample?: number[];
  message: string;
  successCount?: number;
  formula?: string;
  personGuesses?: number[];
}

const TenHatsRiddle: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("input");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [counterExampleHats, setCounterExampleHats] = useState<string[]>([]);
  const [counterExampleNumbers, setCounterExampleNumbers] = useState<number[]>(
    []
  );
  const [currentPersonIndex] = useState(0);
  const [personHighlight, setPersonHighlight] =
    useState<PersonHighlight | null>(null);
  const [currentFormula, setCurrentFormula] = useState<string>("");

  // Hat colors - all valid colors for the rainbow effect
  const availableHatColors = [
    "#000000", // Black - 0
    "#008080", // Teal - 1
    "#ff0000", // Red - 2
    "#ffa500", // Orange - 3
    "#008000", // Green - 4
    "#0000ff", // Blue - 5
    "#8b00ff", // Violet - 6
    "#ff00ff", // Magenta - 7
    "#d2b48c", // Tan - 8
    "#8b4513", // Brown - 9
  ];

  const currentPersonHatColor = "#d3d3d3"; // Light gray for current person

  const calculateAllGuesses = (
    hatColors: number[],
    formula: string
  ): number[] => {
    const guesses: number[] = [];

    for (let personIndex = 0; personIndex < 10; personIndex++) {
      try {
        const guess = calculatePersonGuess(hatColors, formula, personIndex);
        guesses.push(guess);
      } catch (error) {
        console.error(
          `Error calculating guess for person ${personIndex}:`,
          error
        );
        guesses.push(-1); // -1 indicates error
      }
    }

    return guesses;
  };

  const handleTestResult = (result: number[], formula: string) => {
    setCurrentFormula(formula);

    // Clear person highlight when transitioning to results state
    setPersonHighlight(null);

    if (result.length === 0) {
      // Correct solution
      setTestResult({
        isCorrect: true,
        message: "✅ Correct solution! Your formula works for all cases.",
        successCount: 10000000000, // 10 billion successes
        formula: formula,
      });
      setAppState("results");
    } else {
      // Counter example found - extract success count if available
      const successCount = result.length >= 11 ? result[10] : undefined;
      const counterExample = result.slice(0, 10); // First 10 elements are the counter example

      // Calculate what each person would guess with this formula and hat distribution
      const personGuesses = calculateAllGuesses(counterExample, formula);

      const hatColors = counterExample.map(
        (colorIndex) => availableHatColors[colorIndex]
      );
      setCounterExampleHats(hatColors);
      setCounterExampleNumbers(counterExample); // Store numerical values too
      setTestResult({
        isCorrect: false,
        counterExample: counterExample,
        message: `❌ Counter example found! Here's a case where your formula fails.`,
        successCount: successCount,
        formula: formula,
        personGuesses: personGuesses,
      });
      setAppState("results");
    }
  };

  const handleGuessAgain = () => {
    setAppState("input");
    setTestResult(null);
    setCounterExampleHats([]);
    setCounterExampleNumbers([]);
    setPersonHighlight(null);
  };

  const getHatColorsForState = (): string[] => {
    if (appState === "input") {
      // Current person gets light gray, others get rainbow
      const colors = Array(10)
        .fill("")
        .map((_, index) => {
          if (index === currentPersonIndex) {
            return currentPersonHatColor;
          } else {
            return "rainbow";
          }
        });
      return colors;
    } else if (appState === "results" && counterExampleHats.length > 0) {
      // Show counter example colors - ALL people get their colors from the test result
      return counterExampleHats;
    } else {
      // Fallback - show rainbow colors
      return Array(10)
        .fill("")
        .map((_, index) =>
          index === currentPersonIndex ? currentPersonHatColor : "rainbow"
        );
    }
  };

  const formatSuccessRate = (successCount: number): string => {
    const total = 10000000000; // 10 billion
    const percentage = ((successCount / total) * 100).toFixed(3);
    return `${percentage}%`;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f0f0",
        position: "relative",
        padding: "0",
        overflow: "hidden",
      }}
    >
      {/* Title - reduced height */}
      <div
        style={{
          fontSize: "24px",
          fontFamily: "monospace",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          padding: "10px 0", // Reduced from "20px 0"
          height: "44px", // Fixed height instead of flexible padding
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Ten Hats Riddle
      </div>

      {/* State indicator with success rate */}
      <div
        style={{
          position: "absolute",
          top: "625px", // Adjusted for smaller title
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "16px",
          fontFamily: "monospace",
          color: "#666",
          textAlign: "center",
        }}
      >
        {appState === "input"
          ? ""
          : appState === "results" && testResult?.successCount !== undefined
          ? `Success Rate: ${formatSuccessRate(testResult.successCount)}`
          : ""}
      </div>

      {/* Hat Legend */}
      <HatLegend />

      {/* Main content area with Group - takes up remaining space */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingBottom:
            appState === "input" ||
            (appState === "results" && !testResult?.isCorrect)
              ? "140px"
              : "20px",
        }}
      >
        <Group
          numberOfPeople={10}
          radius={10}
          hatColors={getHatColorsForState()}
          showPersonNumbers={appState === "results"}
          currentPersonIndex={currentPersonIndex}
          personHighlight={appState === "input" ? personHighlight : null}
          showIndexLabels={appState === "input"}
          personGuesses={
            appState === "results" ? testResult?.personGuesses : undefined
          }
          formula={appState === "results" ? currentFormula : undefined}
          hatColorNumbers={
            appState === "results" ? counterExampleNumbers : undefined
          }
        />
      </div>

      {/* Bottom section - positioned absolutely at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        {/* Formula bar - show in input state OR results state for failures */}
        {(appState === "input" ||
          (appState === "results" && !testResult?.isCorrect)) && (
          <FormulaBar
            width={600}
            height={120}
            onTestResult={handleTestResult}
            onPersonHighlight={
              appState === "input" ? setPersonHighlight : undefined
            }
            initialFormula={appState === "results" ? currentFormula : undefined}
            showAsReadOnly={appState === "results"}
            onTryAgain={appState === "results" ? handleGuessAgain : undefined}
          />
        )}

        {/* Success message - only show for successful results */}
        {appState === "results" && testResult?.isCorrect && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              border: "2px solid #c3e6cb",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "600px",
              textAlign: "center",
              fontFamily: "monospace",
              margin: "20px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              ✅ You got it! Your formula works for all cases.
            </div>

            <button
              onClick={handleGuessAgain}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontFamily: "monospace",
                fontWeight: "bold",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
              }}
            >
              Try Another Formula
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenHatsRiddle;
