import React from 'react';
import './SkeuSwitch.css';

/**
 * SkeuSwitch — a custom skeuomorphic toggle switch
 *
 * Props:
 *  checked     bool        — toggled state (true = ON, false = OFF)
 *  onChange    function    — state change callback
 *  label       string      — label next to the switch
 *  disabled    bool        — disabled state (default false)
 */
export default function SkeuSwitch({
  checked = false,
  onChange,
  label = '',
  disabled = false,
}) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange && onChange();
    }
  };

  return (
    <div className={`skeu-switch-container ${disabled ? 'skeu-switch--disabled' : ''}`}>
      {label && <span className="skeu-switch-label">{label}</span>}
      <div
        className={`skeu-switch-track ${checked ? 'skeu-switch-track--checked' : ''}`}
        onClick={!disabled ? onChange : undefined}
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {/* Underlay text labels in the slot */}
        <span className="skeu-switch-text skeu-switch-text--off">OFF</span>
        <span className="skeu-switch-text skeu-switch-text--on">ON</span>

        {/* Raised sliding keycap button */}
        <div className={`skeu-switch-thumb ${checked ? 'skeu-switch-thumb--checked' : ''}`}>
          {/* Grip bumps grid (2 rows, 5 columns) */}
          <div className="skeu-switch-grip">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span key={idx} className="skeu-switch-grip-dot" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
