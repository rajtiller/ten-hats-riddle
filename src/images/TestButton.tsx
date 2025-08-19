import React, { useState } from "react";
import { validateFormula } from "./FormulaBar/validation";
import { testFormula, evaluateTestResult } from "./FormulaBar/testFunction";

interface TestButtonProps {
  formula: string;
  onTestResult?: (result: number[]) => void;
}

const TestButton: React.FC<TestButtonProps> = ({ formula, onTestResult }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [testResult, setTestResult] = useState<number[] | null>(null);

  const handleTest = () => {
    setIsValidating(true);
    setErrorMessage("");
    setTestResult(null);

    // Validate the formula using the same validation as FormulaBar
    const validation = validateFormula(formula);

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      setIsValidating(false);
      return;
    }

    try {
      // Use the centralized test function
      const result = testFormula(formula);
      const evaluation = evaluateTestResult(result);

      setTestResult(result);

      // Call the callback if provided
      if (onTestResult) {
        onTestResult(result);
      }

      // Log result
      console.log(evaluation.message);
      if (result.length > 0) {
        console.log(
          "Hat distribution:",
          result
            .map((color, person) => `Person ${person}: Color ${color}`)
            .join(", ")
        );
      }
    } catch (error) {
      setErrorMessage(
        `Test failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    setIsValidating(false);
  };

  const validation = validateFormula(formula);
  const isDisabled = !validation.isValid || isValidating;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        border: "2px solid #333",
        borderRadius: "8px",
        minWidth: "200px",
      }}
    >
      <button
        onClick={handleTest}
        disabled={isDisabled}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          fontFamily: "monospace",
          fontWeight: "bold",
          backgroundColor: isDisabled ? "#ccc" : "#4CAF50",
          color: isDisabled ? "#999" : "white",
          border: "2px solid #333",
          borderRadius: "6px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = "#45a049";
          }
        }}
        onMouseOut={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = "#4CAF50";
          }
        }}
      >
        {isValidating ? "Testing..." : "Test Formula"}
      </button>

      {/* Error message */}
      {errorMessage && (
        <div
          style={{
            color: "#d32f2f",
            fontSize: "14px",
            fontFamily: "monospace",
            textAlign: "center",
            backgroundColor: "#ffebee",
            padding: "8px",
            border: "1px solid #d32f2f",
            borderRadius: "4px",
            maxWidth: "300px",
          }}
        >
          ❌ {errorMessage}
        </div>
      )}

      {/* Test result */}
      {testResult !== null && (
        <div
          style={{
            fontSize: "14px",
            fontFamily: "monospace",
            textAlign: "center",
            padding: "8px",
            borderRadius: "4px",
            maxWidth: "300px",
          }}
        >
          {testResult.length === 0 ? (
            <div
              style={{
                color: "#2e7d32",
                backgroundColor: "#e8f5e8",
                border: "1px solid #2e7d32",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              ✅ Formula is correct!
            </div>
          ) : (
            <div
              style={{
                color: "#d32f2f",
                backgroundColor: "#ffebee",
                border: "1px solid #d32f2f",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              ❌ Counter example found:
              <br />
              <span style={{ fontSize: "12px" }}>
                [{testResult.join(", ")}]
              </span>
              <br />
              <span style={{ fontSize: "11px", opacity: 0.8 }}>
                Person at bottom = 0, clockwise = 1,2,3...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestButton;
