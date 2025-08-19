import React, { useState } from "react";
import FormulaBar from "./FormulaBar/index";
import Group from "./Group";
import HatLegend from "./HatLegend";

type AppState = "input" | "results";

interface TestResult {
  isCorrect: boolean;
  counterExample?: number[];
  message: string;
}

const TenHatsRiddle: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("input");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [counterExampleHats, setCounterExampleHats] = useState<string[]>([]);
  const [currentPersonIndex] = useState(0); // Player is always person 0 and will be positioned at bottom

  // Hat colors - fixed numbering and removed duplicate white
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

  const unknownHatColor = "#696969"; // Dark gray for unknown hats
  const currentPersonHatColor = "#d3d3d3"; // Light gray for current person

  const handleTestResult = (result: number[]) => {
    if (result.length === 0) {
      // Correct solution
      setTestResult({
        isCorrect: true,
        message: "✅ Correct solution! Your formula works for all cases.",
      });
      setAppState("results");
    } else {
      // Counter example found
      const hatColors = result.map(
        (colorIndex) => availableHatColors[colorIndex]
      );
      setCounterExampleHats(hatColors);
      setTestResult({
        isCorrect: false,
        counterExample: result,
        message: `❌ Counter example found! Here's a case where your formula fails.`,
      });
      setAppState("results");
    }
  };

  const handleGuessAgain = () => {
    setAppState("input");
    setTestResult(null);
    setCounterExampleHats([]);
  };

  const getHatColorsForState = (): string[] => {
    if (appState === "input") {
      // Current person gets light gray, others get their actual colors
      const colors = Array(10)
        .fill("")
        .map((_, index) => {
          if (index === currentPersonIndex) {
            return currentPersonHatColor; // Light gray for current person
          } else {
            // For now, use random colors for other people that the current person can see
            return availableHatColors[index % availableHatColors.length];
          }
        });
      return colors;
    } else if (appState === "results" && counterExampleHats.length > 0) {
      // Show counter example colors
      return counterExampleHats;
    } else {
      // Fallback
      return Array(10).fill(unknownHatColor);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        position: "relative",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          fontSize: "24px",
          fontFamily: "monospace",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Ten Hats Riddle
      </div>

      {/* State indicator */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          fontSize: "16px",
          fontFamily: "monospace",
          color: "#666",
          textAlign: "center",
        }}
      >
        {appState === "input"
          ? "🤔 Create a formula to determine your hat color"
          : "🎯 Test Results"}
      </div>

      {/* Hat Legend */}
      <HatLegend />

      {/* Main content area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Group of people */}
        <Group
          numberOfPeople={10}
          radius={10}
          hatColors={getHatColorsForState()}
          showPersonNumbers={appState === "results"}
          currentPersonIndex={currentPersonIndex}
        />

        {/* Formula bar - only show in input state */}
        {appState === "input" && (
          <FormulaBar
            width={600}
            height={120}
            onTestResult={handleTestResult}
          />
        )}

        {/* Results panel - only show in results state */}
        {appState === "results" && testResult && (
          <div
            style={{
              backgroundColor: testResult.isCorrect ? "#d4edda" : "#f8d7da",
              color: testResult.isCorrect ? "#155724" : "#721c24",
              border: `2px solid ${
                testResult.isCorrect ? "#c3e6cb" : "#f5c6cb"
              }`,
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "600px",
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {testResult.message}
            </div>

            {!testResult.isCorrect && testResult.counterExample && (
              <div style={{ fontSize: "14px", marginBottom: "15px" }}>
                Hat distribution: [{testResult.counterExample.join(", ")}]
                <br />
                <span style={{ fontSize: "12px", opacity: 0.8 }}>
                  Person 0 (YOU) is at bottom, numbered clockwise
                </span>
              </div>
            )}

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
              {testResult.isCorrect ? "Try Another Formula" : "Guess Again"}
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          fontSize: "12px",
          fontFamily: "monospace",
          color: "#888",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {appState === "input"
          ? "Your hat (YOU at bottom) appears light gray with ??? because you can't see it. Other people are labeled l[1], l[2], etc. representing their position to your left."
          : "This shows a counter-example where your formula would fail. Study the pattern and try a different approach."}
      </div>
    </div>
  );
};

export default TenHatsRiddle;
