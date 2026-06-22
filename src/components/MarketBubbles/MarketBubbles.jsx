import React, { memo } from 'react';
import styles from './MarketBubbles.module.css';

/**
 * MarketBubbles — Reusable TAM / SAM / SOM visualizer
 *
 * Architecture note:
 *   Rendered in TWO separate layers inside a CSS-grid overlay:
 *   1. SphereLayer  — skeuomorphic sphere graphics, z-index stacked so
 *                     larger bubbles appear in front (classic TAM/SAM/SOM look)
 *   2. TextLayer    — text labels at z-index:10, always above ALL sphere
 *                     graphics so no text is clipped by an adjacent bubble.
 *
 * Props:
 *   bubbles  {BubbleItem[]} – ordered smallest→largest (max 3)
 *   title    {string}
 *   subtitle {string}
 *   dark     {boolean}      – default true
 *
 * BubbleItem: { label, value, description?, color? }
 * color: { base1, base2, base3, specular, rim, shadow, glow }
 */

const DEFAULT_COLORS = [
  {
    base1: '#7b2fff', base2: '#4a0fa8', base3: '#2a0560',
    specular: 'rgba(200,160,255,0.55)',
    rim: 'rgba(160,80,255,0.85)', shadow: 'rgba(80,0,180,0.7)',
    glow: '#9b30ff',
  },
  {
    base1: '#40c4ff', base2: '#0d7fcc', base3: '#043a80',
    specular: 'rgba(180,230,255,0.55)',
    rim: 'rgba(60,180,255,0.88)', shadow: 'rgba(0,60,160,0.7)',
    glow: '#2a9dff',
  },
  {
    base1: '#1e88ff', base2: '#0a52c8', base3: '#041560',
    specular: 'rgba(150,200,255,0.5)',
    rim: 'rgba(40,130,255,0.82)', shadow: 'rgba(0,20,120,0.75)',
    glow: '#1560e0',
  },
];

const SIZE_RATIOS = [0.52, 0.76, 1.0];

const MarketBubbles = memo(function MarketBubbles({
  bubbles = [],
  title,
  subtitle,
  dark = true,
}) {
  if (!bubbles.length) return null;

  const count  = Math.min(bubbles.length, 3);
  const items  = bubbles.slice(0, count);
  const pal    = (i) => items[i]?.color ?? DEFAULT_COLORS[i] ?? DEFAULT_COLORS[0];

  // Build inline CSS vars for each position (sphere + text slot share the same values)
  const cellVars = (i) => ({
    '--size-ratio':  SIZE_RATIOS[i],
    '--anim-delay':  `${i * 0.13}s`,
  });

  const sphereVars = (i) => {
    const p = pal(i);
    return {
      ...cellVars(i),
      '--c-base1':    p.base1    ?? p.glow   ?? '#5500ff',
      '--c-base2':    p.base2    ?? '#2200aa',
      '--c-base3':    p.base3    ?? '#110055',
      '--c-specular': p.specular ?? 'rgba(255,255,255,0.4)',
      '--c-rim':      p.rim      ?? 'rgba(255,255,255,0.6)',
      '--c-shadow':   p.shadow   ?? 'rgba(0,0,0,0.65)',
      '--c-glow':     p.glow     ?? p.base1  ?? '#5500ff',
      zIndex: i + 1,          // SOM=1, SAM=2, TAM=3  (larger in front)
    };
  };

  return (
    <div className={`${styles.wrapper} ${dark ? styles.dark : styles.light}`}>

      {(title || subtitle) && (
        <div className={styles.heading}>
          {title    && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p  className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/*
        CSS-grid overlay: both .sphereLayer and .textLayer occupy grid-area 1/1.
        .textLayer sits at z-index:10, above all sphere z-indexes (1–3),
        so every label is always visible regardless of sphere overlap.
      */}
      <div className={styles.stageGrid}>

        {/* ── Layer 1: sphere graphics ─────────────────── */}
        <div className={styles.sphereLayer} aria-hidden="true">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={styles.bubbleWrap}
              style={sphereVars(i)}
            >
              {/* Cast shadow beneath sphere */}
              <div className={styles.dropShadow} />

              {/* The sphere — overflow:hidden clips all decorative layers */}
              <div className={styles.sphere}>
                <div className={styles.layerBase} />
                <div className={styles.layerRim} />
                <div className={styles.layerSpecPrimary} />
                <div className={styles.layerSpecSecondary} />
                <div className={styles.layerReflect} />
                <div className={styles.layerVignette} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Layer 2: text labels (always on top) ─────── */}
        <div className={styles.textLayer}>
          {items.map((item, i) => (
            <div
              key={`txt_${item.label}`}
              className={styles.textSlot}
              style={cellVars(i)}
            >
              <div className={styles.content}>
                <span className={styles.bubbleLabel}>{item.label}</span>
                <span className={styles.bubbleValue}>{item.value}</span>
                {item.description && (
                  <span className={styles.bubbleDesc}>{item.description}</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
});

export default MarketBubbles;
