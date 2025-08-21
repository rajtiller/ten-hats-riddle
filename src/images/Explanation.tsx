import React from "react";

interface ExplanationProps {
  formula?: string;
  onNavigateToPage: (pageIndex: number) => void;
}

const Explanation: React.FC<ExplanationProps> = ({
  formula,
  onNavigateToPage,
}) => (
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
          Ten people are standing in a circle, each wearing a hat with a number
          from 0-9. Each person can see everyone else's hat but not their own.
          They must simultaneously guess their own hat number. The goal is to
          find a strategy where at most one person guesses incorrectly.
        </p>

        {formula && (
          <>
            <h2 style={{ color: "#007bff", marginTop: "30px" }}>
              Your Solution
            </h2>
            <p>
              Your formula{" "}
              <strong
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "#f8f9fa",
                  padding: "2px 4px",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                }}
              >
                {formula}
              </strong>{" "}
              works! This is a valid solution to the ten hats riddle.
            </p>
          </>
        )}

        <h2 style={{ color: "#007bff", marginTop: "30px" }}>How It Works</h2>
        <p>
          The key insight is that each person uses the visible hat numbers to
          calculate a guess based on modular arithmetic. When everyone follows
          the same formula, the mathematical properties ensure that at most one
          person will be wrong.
        </p>

        <h2 style={{ color: "#007bff", marginTop: "30px" }}>
          Formula Components
        </h2>
        <ul>
          <li>
            <strong>i</strong> - The person's position number (0-9)
          </li>
          <li>
            <strong>l[n]</strong> - The hat number of the person n positions to
            the left
          </li>
          <li>
            <strong>r[n]</strong> - The hat number of the person n positions to
            the right
          </li>
          <li>
            <strong>all</strong> - The sum of all visible hat numbers
          </li>
        </ul>

        <h2 style={{ color: "#007bff", marginTop: "30px" }}>
          Mathematical Foundation
        </h2>
        <p>
          The strategy relies on error-correcting codes. When each person
          follows the same formula, the resulting guesses form a pattern where
          at most one error can occur. This is similar to how computer systems
          detect and correct data transmission errors.
        </p>

        <p style={{ marginTop: "20px" }}>
          All calculations are done modulo 10, so the final guess is always a
          single digit (0-9).
        </p>

        <h2 style={{ color: "#007bff", marginTop: "30px" }}>
          Try More Examples
        </h2>
        <p>Some other formulas that work include:</p>
        <ul
          style={{
            fontFamily: "monospace",
            backgroundColor: "#f8f9fa",
            padding: "15px",
          }}
        >
          <li>i + all</li>
          <li>i + l[1] + l[2] + l[3] + l[4]</li>
          <li>all - r[1] - r[2]</li>
          <li>i × 3 + all</li>
        </ul>

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => onNavigateToPage(0)}
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

          <button
            onClick={() => onNavigateToPage(1)}
            style={{
              padding: "15px 30px",
              fontSize: "18px",
              fontFamily: "monospace",
              fontWeight: "bold",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#5a6268";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#6c757d";
            }}
          >
            Try Two Hats Riddle
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Explanation;
