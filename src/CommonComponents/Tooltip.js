import React, { useState } from "react";
const Tooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  return (
    <div className="tooltip-container">
      <div
        className="hint-button"
        onMouseEnter={toggleTooltip}
        onMouseLeave={toggleTooltip}
      >
        {children}
      </div>
      {showTooltip && <div className="tooltip">{content}</div>}
    </div>
  );
};

export default Tooltip;
