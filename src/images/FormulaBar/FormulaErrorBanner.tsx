/** Shared validation error strip for Ten Hats and Two Hats formula bars. */
export function FormulaErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fee",
        color: "#c33",
        border: "2px solid #faa",
        borderRadius: "8px",
        padding: "6px 10px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "600",
        textAlign: "center",
        boxSizing: "border-box",
        lineHeight: 1.35,
        wordBreak: "break-word",
      }}
    >
      ⚠️ {message}
    </div>
  );
}
