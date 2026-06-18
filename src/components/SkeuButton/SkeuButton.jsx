import React, { useState } from 'react';
import './SkeuButton.css';

/**
 * SkeuButton — a reusable skeuomorphic keycap button
 *
 * Props:
 *  icon        ReactNode   — icon element to render in the center
 *  label       string      — tooltip / aria-label
 *  active      bool        — pressed/selected state
 *  disabled    bool        — disabled state
 *  size        'sm'|'md'|'lg'  — button size (default 'md')
 *  variant     'default'|'danger'|'accent'  — colour variant
 *  onClick     function    — click handler
 *  className   string      — additional class
 */
export default function SkeuButton({
  icon,
  label,
  showLabel = false,
  active    = false,
  disabled  = false,
  size      = 'md',
  variant   = 'default',
  onClick,
  className = '',
  ...rest
}) {
  const [pressed, setPressed] = useState(false);

  const classes = [
    'skeu-btn',
    `skeu-btn--${size}`,
    `skeu-btn--${variant}`,
    showLabel ? 'skeu-btn--labeled' : '',
    active   ? 'skeu-btn--active'   : '',
    disabled ? 'skeu-btn--disabled' : '',
    pressed  ? 'skeu-btn--pressed'  : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={()   => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      {...rest}
    >
      {/* Icon container */}
      <span className="skeu-btn__icon">{icon}</span>

      {/* Inline label — only rendered when showLabel is true */}
      {showLabel && label && (
        <span className="skeu-btn__label">{label}</span>
      )}
    </button>
  );
}

/**
 * SkeuButtonGroup — wraps multiple SkeuButtons into a toolbar row
 *
 * Props:
 *  children    ReactNode
 *  gap         number (px, default 8)
 *  dividerAfter  array of indices — inserts a visual gap after those positions
 */
export function SkeuButtonGroup({ children, gap = 8, dividerAfter = [] }) {
  const items = React.Children.toArray(children);
  return (
    <div className="skeu-btn-group" style={{ gap }}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {dividerAfter.includes(i) && (
            <span className="skeu-btn-divider" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
