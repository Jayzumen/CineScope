import { ImageResponse } from "next/og";

export const alt = "CineScope — Find your next great story";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#101113",
        color: "#f2f0e9",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: 620,
          right: -180,
          top: -190,
          background:
            "radial-gradient(circle, rgba(237,192,120,.3) 0%, rgba(237,192,120,0) 70%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 26,
            letterSpacing: -1,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              border: "7px solid #edc078",
              borderRight: "0px",
              display: "flex",
            }}
          />
          <span>CineScope</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#edc078",
              fontSize: 18,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Cinema, considered
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 74,
              lineHeight: 1.03,
              letterSpacing: -4,
              maxWidth: 880,
            }}
          >
            <span>Find your next</span>
            <span>great story.</span>
          </div>
          <div style={{ color: "#a5a6ac", fontSize: 25 }}>
            Films · Television · People · Your private library
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
