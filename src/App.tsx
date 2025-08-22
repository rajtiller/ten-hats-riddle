import { useState, useEffect } from "react";
import "./App.css";
import TenHatsRiddle from "./images/TenHatsRiddle";
import TwoHatsRiddle from "./images/TwoHatsRiddle";
import Explanation from "./images/Explanation";

function App() {
  const [selectedPage, setSelectedPage] = useState(0);
  const [explanationFormula, setExplanationFormula] = useState<string>("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPage(parseInt(event.target.value));
    setShouldAutoScroll(false); // Reset auto scroll when manually changing pages
  };

  const handleShowExplanation = (formula?: string) => {
    setExplanationFormula(formula || "");
    setShouldAutoScroll(true); // Trigger auto scroll
    setSelectedPage(2); // Navigate to explanation page
  };

  // Reset auto scroll after it's been used
  useEffect(() => {
    if (shouldAutoScroll && selectedPage === 2) {
      // Reset the flag after a short delay to ensure the component has mounted
      const timer = setTimeout(() => {
        setShouldAutoScroll(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoScroll, selectedPage]);

  // Get dropdown width based on current page
  const getDropdownWidth = () => {
    switch (selectedPage) {
      case 0:
        return "140px"; // Ten Hats Riddle - medium width
      case 1:
        return "140px"; // Two Hats Riddle - same width
      case 2:
        return "100px"; // Solution - shorter
      default:
        return "140px";
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
            padding: "8px 8px",
            fontSize: "14px",
            borderRadius: "0px",
            border: "1px solid red",
            backgroundColor: "red",
            color: "white",
            textAlign: "center",
            textAlignLast: "center",
            width: getDropdownWidth(), // Dynamic width
            minWidth: "100px", // Ensure minimum width
          }}
        >
          <option value={0} style={{ textAlign: "center" }}>
            Ten Hats Riddle
          </option>
          <option value={1} style={{ textAlign: "center" }}>
            Two Hats Riddle
          </option>
          <option value={2} style={{ textAlign: "center" }}>
            Solution
          </option>
        </select>
      </div>

      {/* Use TenHatsRiddle component for page 0 */}
      {selectedPage === 0 && (
        <TenHatsRiddle onShowExplanation={handleShowExplanation} />
      )}

      {/* Two hats riddle */}
      {selectedPage === 1 && (
        <TwoHatsRiddle onNavigateToPage={setSelectedPage} />
      )}

      {/* Explanation page */}
      {selectedPage === 2 && (
        <Explanation
          onNavigateToPage={setSelectedPage}
          shouldAutoScroll={shouldAutoScroll}
        />
      )}
    </div>
  );
}

export default App;
