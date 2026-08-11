import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.profile.name}, ${site.profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#fcfcfb",
          backgroundImage:
            "linear-gradient(#e7e8ea 1px, transparent 1px), linear-gradient(90deg, #e7e8ea 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: 22,
            letterSpacing: 2,
            color: "#8a8d96",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 99, backgroundColor: "#a3231c" }} />
          Portfolio
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -4,
            color: "#0c0d10",
          }}
        >
          {site.profile.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 34,
            color: "#7a1a15",
            fontFamily: "monospace",
          }}
        >
          [ {site.profile.role} ]
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            maxWidth: 900,
            color: "#4a4d55",
          }}
        >
          {site.profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
