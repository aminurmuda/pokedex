import React from "react";

export default function Loading() {
  return (
    <div
      className="w-100 has-text-centered"
      style={{
        padding: "4rem",
      }}
    >
      <button
        className="button is-large is-loading"
        style={{
          border: "none",
          background: "none",
        }}
      ></button>
    </div>
  );
}
