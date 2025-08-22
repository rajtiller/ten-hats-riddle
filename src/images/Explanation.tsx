import React, { useState } from "react";

interface ExplanationProps {
  onNavigateToPage: (pageIndex: number) => void;
}

const Explanation: React.FC<ExplanationProps> = ({ onNavigateToPage }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
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
            marginBottom: "20px",
          }}
        >
          The Ten Hats Riddle
        </h1>

        <div
          style={{
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          <h2 style={{ color: "#007bff", marginTop: "-10px" }}>The Problem</h2>
          <p>
            Ten people are standing in a circle, each wearing a hat with a
            random number from 0-9 (repeats allowed). Each person can see
            everyone else's hat but not their own. After ten minutes (for
            observation and calculation), all players must simultaneously guess
            their own hat number. The goal is for at least one of them to guess
            their own hat number correctly. Each person has been given an index,{" "}
            <strong
              style={{
                fontFamily: "monospace",
                backgroundColor: "#f8f9fa",
                padding: "2px 4px",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            >
              i
            </strong>
            , from 0-9 ahead of time. What should person{" "}
            <strong
              style={{
                fontFamily: "monospace",
                backgroundColor: "#f8f9fa",
                padding: "2px 4px",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            >
              i
            </strong>{" "}
            's guess be?
          </p>
          <div
            style={{
              margin: "20px 0",
              paddingTop: "0px",
            }}
          >
            <img
              src="/images/ten-hats-example.png"
              alt="Ten people in a circle wearing colorful numbered hats, showing a counter-example where the formula fails"
              style={{
                maxWidth: "100%",
                height: "auto",
                border: "2px solid #333",
                borderRadius: "8px",
              }}
            />
          </div>
          {/* Action Buttons */}
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "30px",
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
              Try Puzzle
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              style={{
                padding: "15px 30px",
                fontSize: "18px",
                fontFamily: "monospace",
                fontWeight: "bold",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
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
              {showSolution ? "Hide Solution" : "See Solution"}
            </button>
          </div>

          {/* Solution Section - Hidden by default */}
          {showSolution && (
            <>
              <h2 style={{ color: "#007bff", marginTop: "45px" }}>
                The Solution
              </h2>
              <p>
                The formula{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  i - all (mod 10)
                </strong>{" "}
                works no matter what! <br /> (where{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  all
                </strong>{" "}
                is the sum of all hats visible to a person)
              </p>

              <h2 style={{ color: "#007bff", marginTop: "30px" }}>
                How It Works
              </h2>
              <p>
                The key insight is that to an outside observer the sum of all
                the hats (sumHats) mod 10 is a number 0-9. Give each person an
                index,{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  i
                </strong>
                , to differentiate them.
              </p>

              <p>
                Person 0 will assume sumHats ≡ 0 (mod 10). Person 1 will assume
                sumHats ≡ 1 (mod 10). And so on.
              </p>

              <p>
                Every person can guess their own hat color accordingly to make
                this assumption true.
              </p>

              <p>
                For example, if Person 0 sees nine other hats which sum to 38 ({" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  all
                </strong>
                ), they must guess 2, bringing the total to 40 ≡ 0 (mod 10).
              </p>

              <p>
                Let k ≡ sumHats (mod 10). Let's think from the perspective of
                person k.
              </p>

              <p>
                They know sumHats ∈ [all, all + 9]. They have (correctly)
                assumed sumHats ≡ k (mod 10).
              </p>

              <p>
                So they can deduce sumHats. From there, they will guess their
                own hat, ???, is simply sumHats - all.
              </p>

              <p>
                Thus, they've guaranteed that at least one person will guess
                their own hat color correctly.
              </p>

              <p>
                To implement this strategy, person i will go through this logic:
                ??? + all ≡ i (mod 10) ⇒ ??? ≡ i - all (mod 10).
              </p>

              <h2 style={{ color: "#007bff", marginTop: "15px" }}>Misc</h2>
              <p>
                This guarantees there's no situation in which two or more people
                guess their own hat color correctly, as the sumHats mod 10
                cannot be both 0 and 1.
              </p>

              <p style={{ marginTop: "20px" }}>
                All calculations are done modulo 10, so the final guess is
                always a single digit (0-9).
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explanation;
