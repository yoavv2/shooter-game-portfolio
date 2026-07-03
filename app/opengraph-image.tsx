import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = "Yoav Hevroni — Full-Stack Operative";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const gold = "#f2c41d";
const green = "#39d353";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background:
            "radial-gradient(circle at 30% 20%, #151b25 0%, #0b0e13 62%)",
          color: "#e8edf2",
          fontFamily: "sans-serif",
        }}
      >
        {/* corner brackets */}
        <div style={{ position: "absolute", top: 36, left: 36, width: 46, height: 46, borderTop: `4px solid ${gold}`, borderLeft: `4px solid ${gold}` }} />
        <div style={{ position: "absolute", top: 36, right: 36, width: 46, height: 46, borderTop: `4px solid ${gold}`, borderRight: `4px solid ${gold}` }} />
        <div style={{ position: "absolute", bottom: 36, left: 36, width: 46, height: 46, borderBottom: `4px solid ${gold}`, borderLeft: `4px solid ${gold}` }} />
        <div style={{ position: "absolute", bottom: 36, right: 36, width: 46, height: 46, borderBottom: `4px solid ${gold}`, borderRight: `4px solid ${gold}` }} />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, background: green }} />
          <div style={{ fontSize: 26, letterSpacing: 6, color: green, fontWeight: 700 }}>
            {`STATUS: ${profile.status}`}
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 118, fontWeight: 800, lineHeight: 1.02, letterSpacing: 2, color: "#f4f7fa" }}>
          {profile.displayName}
        </div>

        <div style={{ marginTop: 20, fontSize: 34, letterSpacing: 8, color: gold, fontWeight: 700 }}>
          {profile.role}
        </div>

        <div style={{ marginTop: 34, fontSize: 24, letterSpacing: 3, color: "#8b95a1" }}>
          {`React · TypeScript · Node · AI-assisted workflows · ${profile.base}`}
        </div>
      </div>
    ),
    size
  );
}
