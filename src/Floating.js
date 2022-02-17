import React from "react";

export default function Floating({ isActive = false, content }) {
  if (isActive) {
    return (
      <div className="floating">
        <p>{content}</p>
      </div>
    );
  } else {
    return null;
  }
}
