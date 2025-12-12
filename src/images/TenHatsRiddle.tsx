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

interface TenHatsRiddleProps {
  onShowExplanation?: (formula?: string) => void;
}

const TenHatsRiddle: React.FC<TenHatsRiddleProps> = ({ onShowExplanation }) => {
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
  const [showHoverExplanation, setShowHoverExplanation] = useState(false);

  // Hat colors - all valid colors (updated with white instead of teal)
  const availableHatColors = [
    "#000000", // Black - 0
    "#ffffff", // White - 1 (changed from teal)
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
        // console.error(
        //   `Error calculating guess for person ${personIndex}:`,
        //   error
        // );
        guesses.push(-1); // -1 indicates error
      }
    }

    return guesses;
  };

  const handleTestResult = (result: number[], formula: string) => {
    setCurrentFormula(formula);

    // Clear person highlight when transitioning to results state
    setPersonHighlight(null);

    // Check if this is a correct formula with example (length 11 with -1 marker)
    if (result.length === 11 && result[10] === -1) {
      // Correct solution with example configuration
      const exampleConfig = result.slice(0, 10);
      const personGuesses = calculateAllGuesses(exampleConfig, formula);
      const hatColors = exampleConfig.map(
        (colorIndex) => availableHatColors[colorIndex]
      );

      setCounterExampleHats(hatColors);
      setCounterExampleNumbers(exampleConfig);
      setTestResult({
        isCorrect: true,
        counterExample: exampleConfig,
        message:
          "✅ Correct solution! Here's an example where your formula works.",
        formula: formula,
        personGuesses: personGuesses,
      });
      setAppState("results");
    } else if (result.length === 0) {
      // Legacy correct solution path (shouldn't happen with new testFunction)
      setTestResult({
        isCorrect: true,
        message: "✅ Correct solution! Your formula works for all cases.",
        successCount: 10000000000,
        formula: formula,
      });
      setAppState("results");
    } else {
      // Counter example found
      const counterExample = result.slice(0, 10);
      const personGuesses = calculateAllGuesses(counterExample, formula);
      const hatColors = counterExample.map(
        (colorIndex) => availableHatColors[colorIndex]
      );

      setCounterExampleHats(hatColors);
      setCounterExampleNumbers(counterExample);
      setTestResult({
        isCorrect: false,
        counterExample: counterExample,
        message: `❌ Counter example found! Here's a case where your formula fails.`,
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

  const handleSeeExplanation = () => {
    if (onShowExplanation) {
      onShowExplanation(currentFormula); // With formula - goes to solution part
    }
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

  // Success message component that matches FormulaBar dimensions
  const SuccessMessage: React.FC = () => (
    <div
      style={{
        width: 600,
        height: 120,
        border: "none",
        padding: "12px",
        background: "rgba(16, 185, 129, 0.15)",
        backdropFilter: "blur(10px)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#065f46",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center",
        }}
      >
        ✅ You got it! Your formula works for all cases.
      </div>

      <button
        onClick={handleSeeExplanation}
        style={{
          padding: "10px 20px",
          fontSize: "15px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "600",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#2563eb";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#3b82f6";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
        }}
      >
        See Explanation (+ Fun Facts)
      </button>
    </div>
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        position: "relative",
        padding: "0",
        overflow: "hidden",
      }}
    >
      {/* Title with explanation button */}
      <div
        style={{
          fontSize: "28px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "700",
          color: "#1a202c",
          textAlign: "center",
          padding: "16px 0",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          textShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Question mark button on the left */}
        <button
          onMouseEnter={() => setShowHoverExplanation(true)}
          onMouseLeave={() => setShowHoverExplanation(false)}
          style={{
            position: "absolute",
            left: "815px",
            top: "30%",
            transform: "translateY(-50%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "monospace",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            zIndex: 1001,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
          title="Hover to learn about the Ten Hats Riddle"
        >
          ?
        </button>
        Ten Hats Riddle
        {/* Hover Explanation Tooltip */}
        {showHoverExplanation && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 15px)",
              left: "calc(835px - 000px)", // Position tooltip below the question mark at 835px
              backgroundColor: "white",
              border: "2px solid #007bff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
              width: "400px",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              color: "#333",
              lineHeight: "1.5",
            }}
          >
            {/* Arrow pointing up to the question mark */}
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "07px", // Center the arrow above the tooltip, aligned with question mark
                width: "0",
                height: "0",
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid #007bff",
              }}
            />

            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#007bff",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              The Ten Hats Riddle
            </h3>

            <div style={{ marginBottom: "15px" }}>
              <strong>The Setup:</strong> Ten people will randomly be assigned a
              hat numbered 0-9 (repeats allowed). Each person can see everyone
              else's hat but not their own.
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>The Goal:</strong> All people will simultaneously guess
              their own hat number. At least one person must be correct.
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Variables you can use:</strong>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}
              >
                • <strong>i</strong> - your own index (0-9)
                                <br />• <strong>0-9</strong> - literal numbers

                <br />• <strong>all</strong> - sum of all visible hat numbers
                <br />• <strong>l[n]</strong> - person n positions to your left
                <br />• <strong>r[n]</strong> - person n positions to your right
                <br />• <strong>+, -, ×</strong> - mathematical operators
                <br />• <strong>( )</strong> - parentheses for grouping
              </div>
            </div>

            <div
              style={{
                color: "#28a745",
                fontWeight: "bold",
                fontSize: "13px",
                backgroundColor: "#e8f5e8",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #28a745",
              }}
            >
              There are 10^10 combinations!
              <br /> Can you find a strategy that work for all of them? 🧠
            </div>
          </div>
        )}
      </div>

      {/* Helpful information div */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          color: "#2d3748",
          padding: "10px 14px",
          margin: "5px 0 5px 0px",
          borderRadius: "10px",
          border: "2px solid rgba(66, 153, 225, 0.3)",
          fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "500",
          textAlign: "center",
          maxWidth: "200px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          right: "175px",
          top: "18px",
          position: "absolute",
          backdropFilter: "blur(10px)",
        }}
      >
        Stuck? Try the <i>Two Hat Riddle</i> ➜
      </div>

      {/* State indicator with success rate */}
      <div
        style={{
          position: "absolute",
          top: "625px",
          left: "0",
          right: "0",
          fontSize: "16px",
          fontFamily: "monospace",
          color: testResult?.isCorrect ? "#28a745" : "#e41010ff",
          textAlign: "center",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {appState === "input"
          ? ""
          : appState === "results" && testResult?.isCorrect
          ? "✅ Correct Formula - Example Shown"
          : appState === "results" && !testResult?.isCorrect
          ? "❌ Counter-Example Found"
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
          paddingBottom: "140px", // Always same padding since formula bar area is always present
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

      {/* Bottom section - positioned absolutely at bottom - ALWAYS PRESENT */}
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
        {/* Formula bar area - always present but content changes */}
        {appState === "input" ||
        (appState === "results" && !testResult?.isCorrect) ? (
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
        ) : (
          // Success message in same dimensions as FormulaBar
          <SuccessMessage />
        )}
      </div>
    </div>
  );
};

export default TenHatsRiddle;
