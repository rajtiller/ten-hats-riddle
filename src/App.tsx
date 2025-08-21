import { useState } from "react";
import "./App.css";
import TenHatsRiddle from "./images/TenHatsRiddle";
import Group from "./images/Group";
import SimpleFormulaBar from "./images/SimpleFormulaBar";
import Explanation from "./images/Explanation";

function App() {
  const [selectedPage, setSelectedPage] = useState(0);
  const [explanationFormula, setExplanationFormula] = useState<string>("");

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPage(parseInt(event.target.value));
  };

  const handleShowExplanation = (formula?: string) => {
    setExplanationFormula(formula || "");
    setSelectedPage(2); // Navigate to explanation page
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
            textAlign: "center",
            textAlignLast: "center",
          }}
        >
          <option value={0} style={{ textAlign: "center" }}>
            Ten Hats Riddle
          </option>
          <option value={1} style={{ textAlign: "center" }}>
            Two Hats Riddle
          </option>
          <option value={2} style={{ textAlign: "center" }}>
            Explanation
          </option>
        </select>
      </div>

      {/* Use TenHatsRiddle component for page 0 */}
      {selectedPage === 0 && (
        <TenHatsRiddle onShowExplanation={handleShowExplanation} />
      )}

      {/* Two hats riddle */}
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

      {/* Explanation page */}
      {selectedPage === 2 && (
        <Explanation
          formula={explanationFormula}
          onNavigateToPage={setSelectedPage}
        />
      )}
    </div>
  );
}

export default App;
