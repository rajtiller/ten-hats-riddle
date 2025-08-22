import React, { useState, useRef } from "react";

interface ExplanationProps {
  onNavigateToPage: (pageIndex: number) => void;
}

const Explanation: React.FC<ExplanationProps> = ({ onNavigateToPage }) => {
  const [showSolution, setShowSolution] = useState(false);
  const solutionRef = useRef<HTMLHeadingElement>(null);

  const handleSeeSlution = () => {
    setShowSolution(!showSolution);

    // If showing solution, scroll to it
    if (!showSolution) {
      setTimeout(() => {
        solutionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // Small delay to ensure content is rendered
    }
  };

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
              onClick={handleSeeSlution}
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
              <h2
                ref={solutionRef}
                style={{ color: "#007bff", marginTop: "30px" }}
              >
                Solution
              </h2>
              <p>
                Let{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  sumHats
                </strong>{" "}
                be the sum of all ten hats, and let{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                ≡{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  sumHats
                </strong>{" "}
                (mod 10) ∈ [0,9]. <br />
                <br /> Assume, for now, that one of the ten people is able to
                guess the value of{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                correctly. <br />
                <br />
                Then they could deduce their own hat number (
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  ???
                </strong>
                ) like so:
                <br /> <br />
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  ???
                </strong>{" "}
                +{" "}
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
                ={" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  sumHats
                </strong>{" "}
                ≡{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                (mod 10) <br />
                <br />
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  ???
                </strong>{" "}
                +{" "}
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
                ≡{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                (mod 10) <br /> <br />
                So,{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  ???
                </strong>{" "}
                ≡{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                -{" "}
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
                (mod 10).
                <br /> <br />
                Since{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  ???
                </strong>{" "}
                ∈ [0,9],{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  ???
                </strong>{" "}
                ={" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                -{" "}
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
                (mod 10)
                <br /> <br /> Thus, we just need to ensure at least one person
                guesses{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                correctly.
                <br />
                <br /> There are ten possibilities for k and ten people, so have
                each person guess a different value.
                <br />
                <br /> For simplicity, let person{" "}
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
                guess{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  k
                </strong>{" "}
                ={" "}
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
                . <br />
                <br />
                Then we end up with person{" "}
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
                's guess being{" "}
                <strong
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#f8f9fa",
                    padding: "2px 4px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  i - all
                </strong>{" "}
                (mod 10)
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
