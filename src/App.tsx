import { useState } from "react";
import "./App.css";
import TenHatsRiddle from "./images/TenHatsRiddle";
import Group from "./images/Group";
import SimpleFormulaBar from "./images/SimpleFormulaBar";

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

      {/* Use TenHatsRiddle component for page 0 */}
      {selectedPage === 0 && <TenHatsRiddle />}

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
