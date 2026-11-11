"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#101113",
          color: "#f2f0e9",
          fontFamily: "sans-serif",
          padding: 40,
        }}
      >
        <h1>CineScope is temporarily unavailable.</h1>
        <p>Please try again in a moment.</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
