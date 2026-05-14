import { useState, useEffect } from "react";
import "./App.css";
import TenHatsRiddle from "./images/TenHatsRiddle";
import TwoHatsRiddle from "./images/TwoHatsRiddle";
import Explanation from "./images/Explanation";

function App() {
  const [selectedPage, setSelectedPage] = useState(2);
  const [_, setExplanationFormula] = useState<string>("");
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

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          zIndex: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <select
          className="app-page-nav-select"
          value={selectedPage}
          onChange={handlePageChange}
        >
          <option value={0}>Ten Hats Riddle</option>
          <option value={1}>Two Hats Riddle</option>
          <option value={2}>Setup</option>
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
