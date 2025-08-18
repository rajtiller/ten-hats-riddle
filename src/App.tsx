import { useState } from "react";
import "./App.css";
import Group from "./images/Group";
import FormulaBar from "./images/FormulaBar";

function App() {
  const [selectedPage, setSelectedPage] = useState(0);

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPage(parseInt(event.target.value));
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
      <div style={{ position: "absolute", top: "20px", right: "30px" }}>
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
            paddingLeft: "2px", // 12px - 10px to shift left
          }}
        >
          <option value={0}>Ten Hats Riddle</option>
          <option value={1}>Two Hats Riddle</option>
          <option value={2}>Explanation</option>
        </select>
      </div>

      {/* Conditional rendering based on selected page */}
      {selectedPage === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "20px",
          }}
        >
          <Group numberOfPeople={10} radius={10} />
          <FormulaBar />
        </div>
      )}

      {selectedPage === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "20px",
          }}
        >
          <Group numberOfPeople={2} radius={5} />
          <FormulaBar />
        </div>
      )}

      {selectedPage === 2 && (
        <div>
          <h1>Explanation</h1>
          <p>This is where the explanation of the riddles would go...</p>
        </div>
      )}
    </div>
  );
}

export default App;
