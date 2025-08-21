import React, { useState } from "react";
import FormulaBar from "./FormulaBar/index";
import Group from "./Group";
import HatLegend from "./HatLegend";
import { type PersonHighlight } from "./FormulaBar/FormulaDisplay";
import { calculatePersonGuess } from "./FormulaBar/evaluateFormula";

type AppState = "input" | "results" | "explanation";

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

  const handleSeeExplanation = () => {
    setAppState("explanation");
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
        border: "2px solid #c3e6cb",
        padding: "5px",
        backgroundColor: "#d4edda",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#155724",
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        ✅ You got it! Your formula works for all cases.
      </div>

      <button
        onClick={handleSeeExplanation}
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
        See Explanation
      </button>
    </div>
  );

  // Explanation page component
  const ExplanationPage: React.FC = () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontFamily: "monospace",
            fontSize: "32px",
            color: "#333",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Ten Hats Riddle - Explanation
        </h1>

        <div
          style={{
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          <h2 style={{ color: "#007bff", marginTop: "30px" }}>The Problem</h2>
          <p>
            Ten people are standing in a circle, each wearing a hat with a
            number from 0-9. Each person can see everyone else's hat but not
            their own. They must simultaneously guess their own hat number. The
            goal is to find a strategy where at most one person guesses
            incorrectly.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px" }}>The Solution</h2>
          <p>
            Your formula{" "}
            <strong
              style={{
                fontFamily: "monospace",
                backgroundColor: "#f8f9fa",
                padding: "2px 4px",
              }}
            >
              {currentFormula}
            </strong>{" "}
            works! This is a valid solution to the ten hats riddle.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px" }}>How It Works</h2>
          <p>
            The key insight is that each person uses the visible hat numbers to
            calculate a guess based on modular arithmetic. When everyone follows
            the same formula, the mathematical properties ensure that at most
            one person will be wrong.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px" }}>
            Formula Components
          </h2>
          <ul>
            <li>
              <strong>i</strong> - The person's position number (0-9)
            </li>
            <li>
              <strong>l[n]</strong> - The hat number of the person n positions
              to the left
            </li>
            <li>
              <strong>r[n]</strong> - The hat number of the person n positions
              to the right
            </li>
            <li>
              <strong>all</strong> - The sum of all visible hat numbers
            </li>
          </ul>

          <p style={{ marginTop: "30px" }}>
            All calculations are done modulo 10, so the final guess is always a
            single digit.
          </p>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              onClick={handleGuessAgain}
              style={{
                padding: "15px 30px",
                fontSize: "18px",
                fontFamily: "monospace",
                fontWeight: "bold",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#218838";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#28a745";
              }}
            >
              Try Another Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render explanation page if in explanation state
  if (appState === "explanation") {
    return <ExplanationPage />;
  }

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
          color: "#e41010ff",
          textAlign: "center",
        }}
      >
        {appState === "input"
          ? ""
          : appState === "results" &&
            testResult?.successCount !== undefined &&
            !testResult?.isCorrect
          ? `Counter-Example Found`
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
