import React, { memo } from 'react';
import styles from './FunnelChart.module.css';

/**
 * FunnelChart — Reusable 3D skeuomorphic funnel chart
 *
 * Props:
 *   stages   {StageItem[]} – ordered top (widest) → bottom (narrowest):
 *     { label, value, description?, color? }
 *   title    {string}      – optional heading
 *   subtitle {string}      – optional sub-heading
 *   dark     {boolean}     – dark/light background (default true)
 *
 * StageItem.color shape (all optional, falls back to defaults):
 *   { faceLight, faceMid, faceDark, bodyLeft, bodyRight, rimColor, glowColor }
 */

/* ─────────────────────────────────────────────────────────────── */
/*  Default colour palettes  (top → bottom)                       */
/* ─────────────────────────────────────────────────────────────── */
const DEFAULT_COLORS = [
  {
    faceLight: '#e080ff', faceMid: '#9b30ff', faceDark: '#3a0660',
    bodyLeft:  '#c040ff', bodyRight: '#2e0455',
    rimColor:  '#b030ff', glowColor: '#9b30ff',
  },
  {
    faceLight: '#80b8ff', faceMid: '#3a7fff', faceDark: '#081880',
    bodyLeft:  '#4888ff', bodyRight: '#061260',
    rimColor:  '#3870ff', glowColor: '#3a7fff',
  },
  {
    faceLight: '#50daff', faceMid: '#00a8ff', faceDark: '#003e7a',
    bodyLeft:  '#18c0ff', bodyRight: '#002858',
    rimColor:  '#08b8ff', glowColor: '#00a8ff',
  },
  {
    faceLight: '#50ffcc', faceMid: '#00d490', faceDark: '#004838',
    bodyLeft:  '#18e8a0', bodyRight: '#003228',
    rimColor:  '#08dca0', glowColor: '#00d490',
  },
  {
    faceLight: '#ffdb70', faceMid: '#ffaa00', faceDark: '#5c3000',
    bodyLeft:  '#ffb820', bodyRight: '#3a1c00',
    rimColor:  '#ffa800', glowColor: '#ffaa00',
  },
  {
    faceLight: '#ff8090', faceMid: '#ff3055', faceDark: '#6a0018',
    bodyLeft:  '#ff4068', bodyRight: '#480010',
    rimColor:  '#ff2050', glowColor: '#ff3055',
  },
];

/* ─────────────────────────────────────────────────────────────── */
/*  Geometry constants                                             */
/* ─────────────────────────────────────────────────────────────── */
const CX = 162;          // horizontal centre of the funnel
const MAX_RX = 148;      // semi-width of widest stage
const EL_RATIO = 0.235;  // ry/rx — controls perceived depth/perspective
const START_Y = 42;      // y of the first top face
const BODY_TOTAL = 390;  // total pixel height for all stage bodies
const MIN_W_RATIO = 0.21; // narrowest stage width as fraction of MAX_RX
const VB_PAD = 8;         // symmetric padding each side of CX so viewBox centres on CX
// viewBox x-start = -VB_PAD, total width = CX*2 + VB_PAD*2
// → SVG midpoint = (-VB_PAD + CX*2+VB_PAD*2)/2 = CX ✓

function buildGeometry(count) {
  // n+1 edge widths linearly interpolated from max → min
  const edgeWidths = Array.from({ length: count + 1 }, (_, j) => {
    const t = j / count;
    return MAX_RX * (1 - t * (1 - MIN_W_RATIO));
  });

  // Body heights: taller at top, shorter at bottom (visually heavier top)
  const rawH = Array.from({ length: count }, (_, i) => {
    const t = count > 1 ? i / (count - 1) : 0;
    return 1 + 0.45 * (1 - t);
  });
  const sumH = rawH.reduce((a, b) => a + b, 0);
  const bodyHeights = rawH.map(h => (h / sumH) * BODY_TOTAL);

  const geo = [];
  let y = START_Y;
  for (let i = 0; i < count; i++) {
    const topRx = edgeWidths[i];
    const botRx = edgeWidths[i + 1];
    geo.push({
      topRx, topRy: topRx * EL_RATIO,
      botRx, botRy: botRx * EL_RATIO,
      topY: y,
      bodyH: bodyHeights[i],
    });
    y += bodyHeights[i];
  }
  return { geo, totalH: y + 18 };
}

/* ─────────────────────────────────────────────────────────────── */
/*  Component                                                      */
/* ─────────────────────────────────────────────────────────────── */
const FunnelChart = memo(function FunnelChart({
  stages = [],
  title,
  subtitle,
  dark = true,
}) {
  if (!stages.length) return null;

  const count = Math.min(stages.length, 6);
  const items = stages.slice(0, count);

  const { geo, totalH } = buildGeometry(count);
  // Symmetric viewBox: starts at -VB_PAD so funnel centre (CX) is at SVG midpoint
  const VB_W = CX * 2 + VB_PAD * 2;  // 162*2 + 16 = 340

  const pal = (i) => items[i]?.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];

  return (
    <div className={`${styles.wrapper} ${dark ? styles.dark : styles.light}`}>
      {(title || subtitle) && (
        <div className={styles.heading}>
          {title    && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p  className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      <div className={styles.chartRow}>
        {/* ── SVG funnel ─────────────────────────────── */}
        <svg
          className={styles.funnelSvg}
          viewBox={`${-VB_PAD} 0 ${VB_W} ${totalH}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {items.map((_, i) => {
              const p   = pal(i);
              const g   = geo[i];
              const bY  = g.topY + g.bodyH;
              return (
                <React.Fragment key={i}>
                  {/* Body: horizontal gradient, bright-left → dark-right */}
                  <linearGradient
                    id={`fBG_${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={CX - g.topRx} y1={g.topY}
                    x2={CX + g.topRx} y2={g.topY}
                  >
                    <stop offset="0%"   stopColor={p.bodyLeft}   />
                    <stop offset="30%"  stopColor={p.bodyLeft}   stopOpacity="0.82" />
                    <stop offset="100%" stopColor={p.bodyRight}  />
                  </linearGradient>

                  {/* Left-edge highlight strip: white → transparent */}
                  <linearGradient
                    id={`fBH_${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={CX - g.topRx} y1={g.topY}
                    x2={CX - g.topRx + g.topRx * 0.35} y2={g.topY}
                  >
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>

                  {/* Top face: radial gradient, bright catchlight top-left */}
                  <radialGradient id={`fFG_${i}`} cx="36%" cy="32%" r="68%" gradientUnits="objectBoundingBox">
                    <stop offset="0%"   stopColor={p.faceLight} />
                    <stop offset="52%"  stopColor={p.faceMid}   />
                    <stop offset="100%" stopColor={p.faceDark}  />
                  </radialGradient>

                  {/* Bottom rim: dark centre to slightly lighter edge */}
                  <radialGradient id={`fRG_${i}`} cx="50%" cy="42%" r="58%" gradientUnits="objectBoundingBox">
                    <stop offset="0%"   stopColor={p.faceMid}  stopOpacity="0.65" />
                    <stop offset="100%" stopColor={p.faceDark} stopOpacity="1"    />
                  </radialGradient>

                  {/* Glow filter for top-face ambient halo */}
                  <filter id={`fGF_${i}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </React.Fragment>
              );
            })}
          </defs>

          {/* LAYER 1 — Stage bodies (trapezoid frustums) */}
          {items.map((_, i) => {
            const g = geo[i];
            const bY = g.topY + g.bodyH;
            // Body path: side walls + front bottom arc + front top arc (close)
            // Arc sweep flags:
            //   bottom (L→R through front/lowest point): sweep=1 (CW in SVG)
            //   top close (R→L through front):           sweep=0 (CCW in SVG)
            const d = [
              `M ${CX - g.topRx} ${g.topY}`,
              `L ${CX - g.botRx} ${bY}`,
              `A ${g.botRx} ${g.botRy} 0 0 1 ${CX + g.botRx} ${bY}`,
              `L ${CX + g.topRx} ${g.topY}`,
              `A ${g.topRx} ${g.topRy} 0 0 0 ${CX - g.topRx} ${g.topY}`,
              'Z',
            ].join(' ');
            return (
              <g key={`body_${i}`}>
                <path d={d} fill={`url(#fBG_${i})`} />
                {/* Left-edge bright strip overlay */}
                <path d={d} fill={`url(#fBH_${i})`} />
              </g>
            );
          })}

          {/* LAYER 2 — Bottom rim ellipses (depth at base of each stage) */}
          {items.map((_, i) => {
            const g = geo[i];
            const bY = g.topY + g.bodyH;
            return (
              <ellipse key={`rim_${i}`}
                cx={CX} cy={bY}
                rx={g.botRx} ry={g.botRy}
                fill={`url(#fRG_${i})`}
              />
            );
          })}

          {/* LAYER 3 — Top face ellipses (glow + main face + concentric rings) */}
          {items.map((_, i) => {
            const g  = geo[i];
            const p  = pal(i);
            return (
              <g key={`face_${i}`}>
                {/* Ambient glow halo behind face */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx * 1.08} ry={g.topRy * 1.08}
                  fill={p.glowColor}
                  opacity={0.32}
                  filter={`url(#fGF_${i})`}
                />
                {/* Main face disc */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx} ry={g.topRy}
                  fill={`url(#fFG_${i})`}
                />
                {/* Rim edge stroke */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx} ry={g.topRy}
                  fill="none"
                  stroke={p.rimColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.65"
                />

                {/* ── Centered concentric rings (matching reference) ── */}
                {/* Ring 1 — outer shimmer ring, centered */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx * 0.72} ry={g.topRy * 0.72}
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                />
                {/* Ring 2 — mid glow ring, centered */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx * 0.50} ry={g.topRy * 0.50}
                  fill="rgba(255,255,255,0.10)"
                />
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx * 0.50} ry={g.topRy * 0.50}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1"
                />
                {/* Ring 3 — inner bright fill, centered */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx * 0.28} ry={g.topRy * 0.28}
                  fill="rgba(255,255,255,0.22)"
                />
                {/* Bright core — centered */}
                <ellipse
                  cx={CX} cy={g.topY}
                  rx={g.topRx * 0.12} ry={g.topRy * 0.12}
                  fill="rgba(255,255,255,0.55)"
                />
              </g>
            );
          })}
        </svg>


        {/* ── Legend ─────────────────────────────────── */}
        <div
          className={styles.legendWrap}
          aria-label="Funnel stage breakdown"
        >
          {items.map((item, i) => {
            const p = pal(i);
            const g = geo[i];
            return (
              <div
                key={item.label}
                className={styles.legendItem}
              >
                {/* Diamond bullet */}
                <span
                  className={styles.diamond}
                  style={{
                    background: p.glowColor,
                    boxShadow: `0 0 9px 2px ${p.glowColor}80`,
                  }}
                />
                <span className={styles.legendText}>
                  <span className={styles.legendLabel}>{item.label}</span>
                  <span className={styles.legendValue}>{item.value}</span>
                  {item.description && (
                    <span className={styles.legendDesc}>{item.description}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default FunnelChart;
