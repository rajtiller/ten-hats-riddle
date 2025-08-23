import React, { useState, useRef, useEffect } from "react";

interface ExplanationProps {
  onNavigateToPage: (pageIndex: number) => void;
  shouldAutoScroll?: boolean;
}

const Explanation: React.FC<ExplanationProps> = ({
  onNavigateToPage,
  shouldAutoScroll = false,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const solutionRef = useRef<HTMLHeadingElement>(null);

  const handleSeeSlution = () => {
    if (!showSolution) {
      // Show solution first
      setShowSolution(true);

      // Then scroll after a short delay to ensure content is rendered
      setTimeout(() => {
        solutionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 150);
    } else {
      // Hide solution
      setShowSolution(false);
    }
  };

  // Auto scroll effect when component mounts with shouldAutoScroll=true
  useEffect(() => {
    if (shouldAutoScroll) {
      // Show solution and scroll
      setShowSolution(true);

      setTimeout(() => {
        solutionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 300); // Slightly longer delay for page transition
    }
  }, [shouldAutoScroll]);

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
            everyone else's hat but not their own. After some time (for
            observation and calculation), all players must simultaneously guess
            their own hat number. The goal is for at least one of them to guess
            their own hat number correctly. Each person has been given a unique
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

              <h2 style={{ color: "#007bff", marginTop: "30px" }}>Misc</h2>
              <p>
                The nature of the problem guarantees any correct solution will
                have <b>exactly</b> one person guess their hat correctly each
                round. As visualized below, each person can only guess their hat
                correctly <b>10%</b> of the time. This is <b>just enough</b> to
                perfectly cover <b>100%</b> of cases. Any overlaps (situations
                where multiple people guess correctly) would leave some spots
                uncovered (no one guesses correctly).
              </p>

              <div style={{ margin: "20px 0" }}>
                <p style={{ marginBottom: "10px" }}>
                  <strong>Perfect Play:</strong>
                </p>
                <div
                  style={{
                    border: "2px solid #007bff",
                    maxWidth: "500px",
                    margin: "0 auto",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gridTemplateRows: "repeat(2, 1fr)",
                      width: "100%",
                      height: "120px",
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((personIndex) => (
                      <div
                        key={personIndex}
                        style={{
                          borderRight:
                            personIndex % 5 === 4
                              ? "none"
                              : "1px solid #007bff",
                          borderBottom:
                            personIndex < 5 ? "1px solid #007bff" : "none",
                          padding: "8px 4px",
                          textAlign: "center",
                          backgroundColor: "#d18888ff",
                          fontFamily: "monospace",
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: "#ffffffff",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "9px", marginTop: "2px" }}>
                          Person {personIndex} correct (10%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ margin: "20px 0" }}>
                <p style={{ marginBottom: "10px" }}>
                  <strong>Suboptimal Strategy (failure):</strong>
                </p>
                <div
                  style={{
                    border: "2px solid #dc3545",
                    maxWidth: "500px",
                    margin: "0 auto",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gridTemplateRows: "repeat(2, 1fr)",
                      width: "100%",
                      height: "120px",
                    }}
                  >
                    {/* Render all boxes except 4 and 9 normally (light red) */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((personIndex) => (
                      <div
                        key={personIndex}
                        style={{
                          borderRight:
                            personIndex % 5 === 4
                              ? "none"
                              : "1px solid #dc3545",
                          borderBottom:
                            personIndex < 5 ? "1px solid #dc3545" : "none",
                          padding: "8px 4px",
                          textAlign: "center",
                          backgroundColor: "#d18888ff",
                          fontFamily: "monospace",
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: "#ffffffff",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "9px", marginTop: "2px" }}>
                          Person {personIndex} correct (10%)
                        </div>
                      </div>
                    ))}

                    {/* Empty space for box 4 - will be covered by overlays */}
                    <div style={{ backgroundColor: "transparent" }}></div>

                    {/* Empty space for box 9 - will be covered by overlays */}
                    <div style={{ backgroundColor: "transparent" }}></div>
                  </div>

                  {/* Person 4's box (normal position - top 50% of last column) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "80%", // 4th column (0-indexed: 4 * 20% = 80%)
                      top: "0%", // Top row
                      width: "20%",
                      height: "25%", // 25% of total height (50% of one row)
                      backgroundColor: "#d18888ff", // Light red
                      borderRight: "1px solid #dc3545",
                      borderBottom: "1px solid #dc3545",
                      fontFamily: "monospace",
                      fontSize: "8px",
                      fontWeight: "bold",
                      color: "#ffffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  >
                    <div style={{ fontSize: "10px", lineHeight: "1.1" }}>
                      Person 4 (5%)
                    </div>
                  </div>

                  {/* Intersection area (darker red - middle 25% of last column) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "80%", // Same x position
                      top: "25%", // Start of intersection
                      width: "20%",
                      height: "25%", // 25% of total height
                      backgroundColor: "#8b0000", // Dark red for intersection
                      borderRight: "1px solid #dc3545",
                      borderBottom: "1px solid #dc3545",
                      fontFamily: "monospace",
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "#ffffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 3,
                    }}
                  >
                    <div style={{ fontSize: "10px", lineHeight: "1.1" }}>
                      Person 4 & 9 (5%)
                    </div>
                  </div>

                  {/* Person 9's box (bottom 25% of last column) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "80%", // Same x position as Person 4
                      top: "50%", // Bottom portion
                      width: "20%",
                      height: "25%", // 25% of total height
                      backgroundColor: "#d18888ff", // Light red
                      borderRight: "1px solid #dc3545",
                      borderBottom: "1px solid #dc3545",
                      fontFamily: "monospace",
                      fontSize: "8px",
                      fontWeight: "bold",
                      color: "#ffffffff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 2,
                    }}
                  >
                    <div style={{ fontSize: "10px", lineHeight: "1.1" }}>
                      Person 9
                    </div>
                  </div>

                  {/* Uncovered area (white - bottom 25% of last column) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "80%", // Same x position
                      top: "75%", // Bottom 25%
                      width: "20%",
                      height: "25%", // 25% of total height
                      backgroundColor: "white", // White for uncovered
                      borderRight: "1px solid #dc3545",
                      fontFamily: "monospace",
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "#dc3545",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                    }}
                  >
                    <div style={{ fontSize: "10px", lineHeight: "1.1" }}>
                      Uncovered
                    </div>
                  </div>
                </div>
              </div>

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
                    backgroundColor: "#9a18c6ff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#70158eff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#9a18c6ff";
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
