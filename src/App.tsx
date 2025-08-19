import { useState } from "react";
import "./App.css";
import Group from "./images/Group";
import FormulaBar from "./images/FormulaBar/index";
import SimpleFormulaBar from "./images/SimpleFormulaBar";
import HatLegend from "./images/HatLegend";

// Add state type for ten hats riddle
type TenHatsState = "input" | "results";

function App() {
  const [selectedPage, setSelectedPage] = useState(0);
  // Add state management for ten hats riddle
  const [tenHatsState, setTenHatsState] = useState<TenHatsState>("input");
  const [counterExampleHats, setCounterExampleHats] = useState<string[]>([]);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPage(parseInt(event.target.value));
    // Reset ten hats state when switching pages
    setTenHatsState("input");
    setCounterExampleHats([]);
  };

  // Handle test results from FormulaBar
  const handleTestResult = (result: number[]) => {
    if (result.length === 0) {
      // Correct solution - could show success state
      setTenHatsState("results");
      setCounterExampleHats([]);
    } else {
      // Counter example found - show the hat colors
      const hatColors = [
        "#000000", // Black - 0
        "#008080", // Teal - 1 (changed from gray)
        "#ff0000", // Red - 2
        "#ffa500", // Orange - 3
        "#008000", // Green - 4
        "#0000ff", // Blue - 5
        "#8b00ff", // Violet - 6
        "#ff00ff", // Magenta - 7
        "#d2b48c", // Tan - 8
        "#8b4513", // Brown - 9
      ];

      const exampleHatColors = result.map(
        (colorIndex) => hatColors[colorIndex]
      );
      setCounterExampleHats(exampleHatColors);
      setTenHatsState("results");
    }
  };

  const handleGuessAgain = () => {
    setTenHatsState("input");
    setCounterExampleHats([]);
  };

  // Determine hat colors based on state
  const getHatColors = () => {
    if (tenHatsState === "input") {
      // Show rainbow hats for all people in input state
      return Array(10).fill("rainbow");
    } else {
      // Show counter example or success colors
      return counterExampleHats.length > 0
        ? counterExampleHats
        : Array(10).fill("rainbow"); // Show rainbow for success too
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {/* Dropdown in top right */}
      <div
        style={{ position: "absolute", top: "20px", right: "30px", zIndex: 20 }}
      >
        <select
          value={selectedPage}
          onChange={handlePageChange}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "0px",
            border: "1px solid red",
            backgroundColor: "red",
            color: "white",
            paddingLeft: "2px",
          }}
        >
          <option value={0}>Ten Hats Riddle</option>
          <option value={1}>Two Hats Riddle</option>
          <option value={2}>Explanation</option>
        </select>
      </div>

      {/* State indicator for ten hats riddle */}
      {selectedPage === 0 && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            fontSize: "16px",
            fontFamily: "monospace",
            color: "#666",
            fontWeight: "bold",
          }}
        >
          {tenHatsState === "input" ? "🤔 Formula Mode" : "🎯 Test Results"}
        </div>
      )}

      {/* Conditional rendering based on selected page */}
      {selectedPage === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            paddingTop: "60px",
            paddingBottom: tenHatsState === "input" ? "200px" : "100px",
            justifyContent: "center",
          }}
        >
          {/* Hat Legend on the left - update based on state */}
          <HatLegend />

          {/* Group with state-dependent hat colors */}
          <Group
            numberOfPeople={10}
            radius={10}
            hatColors={getHatColors()}
            showPersonNumbers={tenHatsState === "results"}
          />

          {/* Formula bar - only show in input state */}
          {tenHatsState === "input" && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <FormulaBar onTestResult={handleTestResult} />
            </div>
          )}

          {/* Results panel - only show in results state */}
          {tenHatsState === "results" && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor:
                  counterExampleHats.length > 0 ? "#f8d7da" : "#d4edda",
                color: counterExampleHats.length > 0 ? "#721c24" : "#155724",
                border: `2px solid ${
                  counterExampleHats.length > 0 ? "#f5c6cb" : "#c3e6cb"
                }`,
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                fontFamily: "monospace",
                maxWidth: "600px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {counterExampleHats.length > 0
                  ? "❌ Counter example found! Your formula fails in this case."
                  : "✅ Correct solution! Your formula works for all cases."}
              </div>

              {counterExampleHats.length > 0 && (
                <div style={{ fontSize: "14px", marginBottom: "15px" }}>
                  This hat distribution breaks your formula. Study the pattern
                  and try again.
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
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#0056b3";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#007bff";
                }}
              >
                {counterExampleHats.length > 0
                  ? "Guess Again"
                  : "Try Another Formula"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Two hats riddle remains unchanged */}
      {selectedPage === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            paddingTop: "60px",
            paddingBottom: "140px",
            justifyContent: "center",
          }}
        >
          <Group numberOfPeople={2} radius={5} />
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <SimpleFormulaBar />
          </div>
        </div>
      )}

      {selectedPage === 2 && (
        <div style={{ padding: "20px" }}>
          <h1>Explanation</h1>
          <p>This is where the explanation of the riddles would go...</p>
        </div>
      )}
    </div>
  );
}

export default App;
