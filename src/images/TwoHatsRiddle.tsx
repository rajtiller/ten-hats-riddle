import React, { useState } from "react";
import Group from "./Group";
import { type PersonHighlight } from "./TwoHatsFormulaDisplay";
import TwoHatsFormulaBar from "./TwoHatsFormulaBar";
import { HatClass } from "./Hat";

type AppState = "input" | "results";

interface TestResult {
  isCorrect: boolean;
  counterExample?: number[];
  message: string;
  formula?: string;
  personGuesses?: number[];
}

interface TwoHatsRiddleProps {
  onNavigateToPage?: (pageIndex: number) => void;
}

const TwoHatsRiddle: React.FC<TwoHatsRiddleProps> = ({ onNavigateToPage }) => {
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
  const [showExplanation, setShowExplanation] = useState(false); // Add this state

  // Hat colors for two hats riddle - only black and white
  const availableHatColors = [
    "#000000", // Black - 0
    "#ffffff", // White - 1
  ];

  const currentPersonHatColor = "#d3d3d3"; // Light gray for current person

  const calculatePersonGuess = (
    allHatColors: number[],
    formula: string,
    personIndex: number
  ): number => {
    if (allHatColors.length !== 2) {
      throw new Error("allHatColors array must contain exactly 2 elements");
    }

    let processedFormula = formula.trim();

    // Replace 'i' with the person's NUMBER (their index)
    processedFormula = processedFormula.replace(
      /\bi\b/g,
      personIndex.toString()
    );

    // Replace 'other' with the other person's hat color
    const otherPersonIndex = personIndex === 0 ? 1 : 0;
    processedFormula = processedFormula.replace(
      /\bother\b/g,
      allHatColors[otherPersonIndex].toString()
    );

    // Replace operators
    processedFormula = processedFormula.replace(/×/g, "*");

    try {
      const result = new Function(
        `"use strict"; return (${processedFormula})`
      )();
      if (Number.isFinite(result)) {
        const modResult = ((result % 2) + 2) % 2; // mod 2 for two hats
        return Math.floor(modResult);
      }
    } catch (error) {
      console.error(
        `Error evaluating formula for person ${personIndex}:`,
        error
      );
      return -1;
    }

    return -1;
  };

  const calculateAllGuesses = (
    hatColors: number[],
    formula: string
  ): number[] => {
    const guesses: number[] = [];
    for (let personIndex = 0; personIndex < 2; personIndex++) {
      try {
        const guess = calculatePersonGuess(hatColors, formula, personIndex);
        guesses.push(guess);
      } catch (error) {
        guesses.push(-1);
      }
    }
    return guesses;
  };

  const handleTestResult = (result: number[], formula: string) => {
    setCurrentFormula(formula);
    setPersonHighlight(null);

    if (result.length === 3 && result[2] === -1) {
      // Correct solution with example configuration
      const exampleConfig = result.slice(0, 2);
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
    } else {
      // Counter example found
      const counterExample = result.slice(0, 2);
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

  const getHatColorsForState = (): string[] => {
    if (appState === "input") {
      return [
        currentPersonHatColor, // Current person (index 0) gets gray hat
        "half-black-white", // Other person (index 1) gets half black/white hat
      ];
    } else if (appState === "results" && counterExampleHats.length > 0) {
      return counterExampleHats;
    } else {
      return [currentPersonHatColor, "half-black-white"];
    }
  };

  // Convert PersonHighlight to the format expected by Group component
  const getGroupPersonHighlight = () => {
    if (!personHighlight || appState !== "input") return null;

    if (personHighlight.type === "current") {
      return { personIndex: currentPersonIndex, type: "current" as const };
    } else if (personHighlight.type === "other") {
      const otherPersonIndex = currentPersonIndex === 0 ? 1 : 0;
      return { personIndex: otherPersonIndex, type: "hat" as const };
    }

    return null;
  };

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

      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={handleGuessAgain}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            fontFamily: "monospace",
            fontWeight: "bold",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#c82333";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#dc3545";
          }}
        >
          Try Again
        </button>

        <button
          onClick={() => onNavigateToPage && onNavigateToPage(0)}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            fontFamily: "monospace",
            fontWeight: "bold",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
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
          Try Ten Hats Riddle
        </button>
      </div>
    </div>
  );

  // Hat color legend component with actual hat visuals - BIGGER SIZE
  const HatColorLegend: React.FC = () => {
    const hatColors = [
      { name: "Black", color: "#000000", value: 0 },
      { name: "White", color: "#ffffff", value: 1 },
    ];

    const sizeScale = 1.8; // Increased from 1.0 to make hats bigger

    return (
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#f5f5f5",
          border: "2px solid #333",
          borderRadius: "8px",
          padding: "15px",
          minWidth: "180px", // Increased to accommodate bigger hats
          zIndex: 10,
        }}
      >
        <h3
          style={{
            margin: "0 0 15px 0",
            fontSize: "20px", // Increased from 18px
            fontFamily: "monospace",
            textAlign: "center",
            borderBottom: "1px solid #666",
            paddingBottom: "8px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Hat Colors
        </h3>

        {hatColors.map((hatInfo, index) => {
          const hat = new HatClass(hatInfo.color, "cap");

          // Calculate scaled dimensions - increased size
          const scaledSize = Math.ceil(50 * sizeScale); // Increased from 40
          const viewBoxWidth = Math.ceil(80 * sizeScale); // Increased from 70
          const viewBoxHeight = Math.ceil(60 * sizeScale); // Increased from 50
          const viewBoxX = Math.ceil(-40 * sizeScale); // Adjusted from -35
          const viewBoxY = Math.ceil(-50 * sizeScale); // Adjusted from -45

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px", // Increased from 8px
                fontSize: "16px", // Increased from 14px
                fontFamily: "monospace",
                height: `${scaledSize}px`,
              }}
            >
              <div
                style={{
                  marginRight: "12px", // Increased from 10px
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                }}
              >
                <svg
                  width={scaledSize}
                  height={scaledSize}
                  viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
                >
                  {hat.render(0, 0, 0, false, false, sizeScale * 1.2)}{" "}
                  {/* Increased scale */}
                </svg>
              </div>

              <span
                style={{
                  marginRight: "10px", // Increased from 8px
                  minWidth: "70px", // Increased from 60px
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {hatInfo.name}
              </span>

              <span
                style={{
                  backgroundColor: "#d3d3d3",
                  border: "1px solid #999",
                  padding: "4px 8px", // Increased padding
                  borderRadius: "4px", // Increased border radius
                  minWidth: "35px", // Increased from 30px
                  textAlign: "center",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "28px", // Increased from 24px
                  fontSize: "14px", // Added explicit font size
                  fontWeight: "bold",
                }}
              >
                {hatInfo.value}
              </span>
            </div>
          );
        })}
      </div>
    );
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
      {/* Title */}
      <div
        style={{
          fontSize: "24px",
          fontFamily: "monospace",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          padding: "10px 0",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Two Hats Riddle
      </div>

      {/* Hat Color Legend */}
      <HatColorLegend />

      {/* State indicator */}
      <div
        style={{
          position: "absolute",
          top: "605px", // Changed from "625px" to move it higher
          left: "0",
          right: "0",
          fontSize: "16px",
          fontFamily: "monospace",
          color: testResult?.isCorrect ? "#ffffffff" : "#e41010ff",
          textAlign: "center",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {appState === "input" ? (
          ""
        ) : appState === "results" && testResult?.isCorrect ? (
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <div
              style={{
                padding: "12px 24px", // Reduced vertical padding slightly
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
              onMouseEnter={() => setShowExplanation(true)}
              onMouseLeave={() => setShowExplanation(false)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
              }}
            >
              Why Does This Work?
            </div>

            {/* Explanation Tooltip */}
            {showExplanation && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 15px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "white",
                  border: "2px solid #007bff",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  zIndex: 1000,
                  width: "500px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  color: "#333",
                  lineHeight: "1.5",
                }}
              >
                {/* Arrow pointing down */}
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "0",
                    height: "0",
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid #007bff",
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
                  How the Two Hats Riddle Works
                </h3>

                <div style={{ marginBottom: "15px" }}>
                  <strong>Key Insight:</strong> The two hats will either have the same or different numbers.
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <strong>The Strategy:</strong> One person guesses the hat they see. One person guesses the opposite of the hat they see.
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <strong>Putting It Into Practice:</strong>{" "}<strong
                                style={{
                                  fontFamily: "monospace",
                                  backgroundColor: "#f8f9fa",
                                  padding: "2px 4px",
                                  border: "1px solid #ddd",
                                  borderRadius: "3px",
                                }}
                              >
                                i + other
                              </strong> / <strong
                                            style={{
                                              fontFamily: "monospace",
                                              backgroundColor: "#f8f9fa",
                                              padding: "2px 4px",
                                              border: "1px solid #ddd",
                                              borderRadius: "3px",
                                            }}
                                          >
                                            i - other
                                          </strong>
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
                    → Person 0 guesses both hats have the same number{"   "}
                    <br /><br />
                    → Person 1 guesses the hats have different numbers
                  </div>
                </div>

                <div
                  style={{
                    color: "#28a745",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  🎯 This works for ALL possible hat combinations!
                </div>
              </div>
            )}
          </div>
        ) : appState === "results" && !testResult?.isCorrect ? (
          "❌ Counter-Example Found"
        ) : (
          ""
        )}
      </div>

      {/* Main content area with Group */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingBottom: "80px", // Reduced from 140px to give more height to the people area
        }}
      >
        <Group
          numberOfPeople={2}
          radius={5}
          hatColors={getHatColorsForState()}
          showPersonNumbers={appState === "results"}
          currentPersonIndex={currentPersonIndex}
          personHighlight={getGroupPersonHighlight()}
          showIndexLabels={appState === "input"}
          personGuesses={
            appState === "results" ? testResult?.personGuesses : undefined
          }
          formula={appState === "results" ? currentFormula : undefined}
          hatColorNumbers={
            appState === "results" ? counterExampleNumbers : undefined
          }
          isTwoHatsRiddle={true}
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
        {appState === "input" ||
        (appState === "results" && !testResult?.isCorrect) ? (
          <TwoHatsFormulaBar
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
          <SuccessMessage />
        )}
      </div>
    </div>
  );
};

export default TwoHatsRiddle;
