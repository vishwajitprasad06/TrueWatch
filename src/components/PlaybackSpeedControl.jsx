import { useState } from "react";

function PlaybackSpeedControl({ videoRef }) {
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (videoRef && videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const speeds = [0.5, 1, 1.25, 1.5, 2];

  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {speeds.map((s) => (
        <button
          key={s}
          onClick={() => handleSpeedChange(s)}
          style={{
            background: speed === s ? "#e50914" : "#1f1f1f",
            color: "white",
            border: "1px solid #333",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {s}x
        </button>
      ))}
    </div>
  );
}

export default PlaybackSpeedControl;