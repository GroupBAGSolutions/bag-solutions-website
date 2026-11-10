import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const PX: [number, number, number][] = [
  [7, 0, 1], [14, 0, 0.7], [0, 7, 0.55], [7, 7, 0.85], [21, 7, 1], [14, 14, 0.7], [21, 14, 0.9],
];

export default function AppleIcon() {
  const k = 4.6;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#020A1A" }}>
        <div style={{ position: "relative", width: 26 * k, height: 19 * k, display: "flex" }}>
          {PX.map(([x, y, o], i) => (
            <div key={i} style={{ position: "absolute", left: x * k, top: y * k, width: 5 * k, height: 5 * k, borderRadius: k, background: "#0E74E1", opacity: o }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
